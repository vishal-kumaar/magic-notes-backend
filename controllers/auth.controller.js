import User from "../models/user.schema.js";
import asyncHandler from "../helpers/asyncHandler.js";
import CustomError from "../utils/CustomError.js"
import mailSender from "../utils/mailSender.js";
import crypto from "crypto";
import generatePassword from "../utils/generatePassword.js";
import config from "../config/config.js";

/***************************************************
 * @SIGNUP
 * @METHOD POST
 * @route /api/auth/signup
 * @description User signup controller for creating a new user
 * @description Generate random password
 * @description Generate OTP to verify email
 * @parameters name, email
 * @return Success message and send mail to user
 ************************************************/

export const signUp = asyncHandler(async (req, res) => {
    const {name, email} = req.body;
    
    if (!name || !email){
        throw new CustomError("Name or email are required", 400);
    }

    const existingUser = await User.findOne({email});

    if (existingUser && existingUser.verified){
        throw new CustomError("User already exists", 400);
    }

    
    if (existingUser){
        const otp = await existingUser.generateOTP();
        existingUser.name = name;
        await existingUser.save();

        const text = `A sign up attempt require further verfication because we did not recognize yourself. To complete sign up, please enter the OTP.\n\nUser: ${existingUser.name}\nOTP: ${otp}\n\nNOTE:- OTP is only valid for next 30 minutes`;
        try {
            mailSender({
                email,
                subject: `Verification mail for ${req.get("host")}`,
                text: text,
            });
        } catch (error) {
            existingUser.otp = undefined;
            existingUser.otpExpiry = undefined;
            existingUser.save();

            throw new CustomError(error.message || "Mail not sent", 400);
        }

        res.status(200).json({
            success: true,
            user: existingUser,
            message: `OTP sent to ${email}`
        });
    }
    else {
        const user = await User.create({
            name,
            email
        });

        const otp = await user.generateOTP();
        await user.save();

        const text = `A sign up attempt require further verfication because we did not recognize yourself. To complete sign up, please enter the OTP.\n\nUser: ${name}\nOTP: ${otp}\n\nNOTE:- OTP is only valid for next 30 minutes`;

        try {
            mailSender({
                email,
                subject : `Verification mail for ${req.get("host")}`,
                text: text
            });
        } catch (error) {
            user.otp = undefined;
            user.otpExpiry = undefined;
            user.save();

            throw new CustomError(error.message || "Mail not sent", 400);
        }
        res.status(200).json({
            success: true,
            user,
            message: `OTP sent to ${email}`
        });
    }

});

/***************************************************
 * @VERIFY_USER
 * @METHOD PUT
 * @route /api/auth/user/verify/id
 * @description Verify user controller for verifying new user
 * @description Verify OTP and mail password to the user
 * @parameters userId, OTP
 * @return Success message
 ************************************************/

export const verifyUser = asyncHandler(async(req, res) => {
    const {id} = req.params;
    if (!id){
        throw new CustomError("User id is required", 400);
    }

    const {otp} = req.body;
    if (!otp){
        throw new CustomError("OTP is required", 400)
    }

    const user = await User.findById(id).select("+password");
    if (!user){
        throw new CustomError("Something went wrong", 400)
    }
    
    if (user.otpExpiry <= Date.now()){
        throw new CustomError("OTP expired", 400);
    }

    const validOTP = (crypto.createHash("sha512").update(otp).digest("hex")) === user.otp;
    if (!validOTP){
        throw new CustomError("OTP is invalid", 400);
    }
    
    const password = generatePassword();
    user.password = password;
    await user.save();

    try {
        const text = `Congratulations!! Your email is successfully verified and now you are eligible to access our website.\n\nYour password: ${password}\n\nNOTE:- After successful login change this password for security reasons.\n\nThank you for using our website:)`

        mailSender({
            email: user.email,
            subject: `Your password for ${req.get("host")}`,
            text: text
        });

        user.otp = undefined;
        user.otpExpiry = undefined;
        user.verified = true;
        await user.save();
    } catch (error) {
        throw new CustomError(error || "Mail not sent", 400)
    }

    res.status(200).json({
        success: true,
        message: `Password sent to ${user.email}`
    });
});

/***************************************************
 * @LOGIN
 * @METHOD POST
 * @route /api/auth/login
 * @description User login controller for login an existing user
 * @parameters email, password
 * @return User Object
 ************************************************/

export const logIn = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password){
        throw new CustomError("Email or password are required", 400);
    }

    const user = await User.findOne({email}).select("+password");

    if (!user){
        throw new CustomError("Invalid credentials", 400);
    }

    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched){
        throw new CustomError("Invalid credentials", 400);
    }

    const token = user.getJwtToken();
    user.password = undefined;

    res.status(200).json({
        success: true,
        token,
        user,
    });
});

/***************************************************
 * @FORGOT_PASSWORD
 * @METHOD PUT
 * @route /api/auth/password/forgot
 * @description User forgot password controller for forgot the password
 * @description User submit email to generate a forget password token
 * @description User receives an url to forgot the password
 * @parameters email
 * @return Success message
 ************************************************/

export const forgotPassword = asyncHandler(async(req, res) => {
    const {email} = req.body;
    
    if (!email){
        throw new CustomError("Email is required",  400);
    }

    const user = await User.findOne({email});

    if (!user){
        throw new CustomError("Email is invalid", 400);
    }

    const resetToken = await user.generateForgotPasswordToken();
    user.save({validateBeforeSave: true});

    let protocol = "http";
    if (config.NODE_ENV === "production"){
        protocol = "https";
    }
    const resetUrl = `${protocol}://${req.get("host")}/password/reset/${resetToken}`;
    
    const text = `Your password reset url is\n\n${resetUrl}\n\nClick to reset the password and it is valid for 20 minutes`;

    try {
        mailSender({
            email,
            subject: `Password reset mail for ${req.get("host")}`,
            text: text,
        });

        res.status(200).json({
            success: true,
            message: `Mail send to ${email}`,
        });
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save({validateBeforeSave: true});
        
        throw new CustomError(error.message || "Failed to send mail", 400);
    }
});

/***************************************************
 * @RESET_PASSWORD
 * @METHOD PUT
 * @route /api/auth/password/reset/resetToken
 * @description User reset password controller for reset the password
 * @description User submit email to generate a token
 * @parameters Password and Confirm password
 * @return Success message
 ************************************************/

export const resetPassword = asyncHandler(async(req, res) => {
    const {resetToken} = req.params;
    
    if (!resetToken){
        throw new CustomError("Reset token is required", 400);
    }
    
    const {password, confirmPassword} = req.body;

    if (!password || !confirmPassword){
        throw new CustomError("Password or confirm are required", 400);
    }
    
    if (password !== confirmPassword){
        throw new CustomError("Confirm password must be same as the password", 400);
    }
    
    const resetPasswordToken = crypto.createHash("sha512").update(resetToken).digest("hex");

    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    });

    if (!user){
        throw new CustomError("Something went wrong", 400);
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: "Successfully reset password"
    });
});

/***************************************************
 * @UPDATE_PASSWORD
 * @METHOD PUT
 * @route /api/auth/password/update/id
 * @description User update password controller for update the old password
 * @parameters Old password and new password
 * @return Success message with user object
 ************************************************/

export const updatePassword = asyncHandler(async(req, res) => {
    const {id} = req.params;

    if (!id){
        throw new CustomError("Id is required", 400);
    }

    const {oldPassword, newPassword, confirmPassword} = req.body;
    if (!oldPassword || !newPassword || !confirmPassword){
        throw new CustomError("All fields are required", 400);
    }

    if (oldPassword === newPassword){
        throw new CustomError("Old and new password are same", 400);
    }

    if (newPassword !== confirmPassword){
        throw new CustomError("Wrong confirm new password", 400)
    }

    const user = await User.findById(id).select("+password");

    if (!user){
        throw new CustomError("Not authorized to access this route", 401);
    }

    const passwordMatched = await user.comparePassword(oldPassword);

    if (!passwordMatched){
        throw new CustomError("Password is wrong", 400);
    }

    user.password = newPassword;
    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        user,
    })
});

/********************************************************
 * @UPDATE_NAME
 * @METHOD PUT
 * @route /api/auth/username/update/:id
 * @description User update name controller for update the old name
 * @parameters new name and password
 * @return Success message with user object
*********************************************************/

export const updateName = asyncHandler(async(req, res) => {
    const {id} = req.params;
    if (!id){
        throw new CustomError("Id is required", 400)
    }

    const {newName, password} = req.body;
    if (!newName || !password){
        throw new CustomError("All fields are required", 400);
    }

    const user = await User.findById(id).select("+password");
    if (!user){
        throw new CustomError("Not authorized to access this route", 401)
    }

    const passwordMatched = await user.comparePassword(password)

    if (!passwordMatched){
        throw new CustomError("Password is wrong", 400);
    }
    
    user.name = newName;
    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        user
    })
});

/********************************************************
 * @GET_PROFILE
 * @METHOD GET
 * @route /api/auth/profile
 * @description Check for token and populate req.user
 * @parameters 
 * @return User object
*********************************************************/

export const getProfile = asyncHandler(async(req, res) => {
    const {user} = req;

    if (!user){
        throw new CustomError("User not found", 400);
    }

    res.status(200).json({
        success: true,
        user
    });
});