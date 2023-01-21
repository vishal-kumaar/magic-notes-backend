import User from "../models/user.schema.js";
import asyncHandler from "../helpers/asyncHandler.js";
import CustomError from "../utils/CustomError.js"
import cookieOptions from "../utils/cookieOptions.js";
import mailSender from "../utils/mailSender.js";
import crypto from "crypto";

/***************************************************
 * @SIGNUP
 * @route http://localhost:4000/api/auth/signup
 * @description User signup controller for creating a new user
 * @parameters name, email, password
 * @return User Object
 ************************************************/

export const signUp = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    
    if (!name || !email || !password){
        throw new CustomError("All fields are required", 400);
    }

    const existingUser = await User.findOne({email});

    if (existingUser){
        throw new CustomError("All fields are required", 400);
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    const token = user.getJwtToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        success: true,
        token,
        user,
    });
});


/***************************************************
 * @LOGIN
 * @route http://localhost:4000/api/auth/login
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

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        success: true,
        token,
        user,
    });
});

/***************************************************
 * @LOGOUT
 * @route http://localhost:4000/api/auth/logout
 * @description User logout controller for logout an logged in user by clearing the cookies
 * @parameters None
 * @return Success message
 ************************************************/

export const logOut = asyncHandler(async(_req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out",
    });
});

/***************************************************
 * @FORGOT_PASSWORD
 * @route http://localhost:4000/api/auth/password/forgot
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

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`;
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
 * @route http://localhost:4000/api/auth/password/reset/resetToken
 * @description User reset password controller for reset the password
 * @description User submit email to generate a token
 * @parameters Password and Confirm password
 * @return User object
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

    console.log(user);

    if (!user){
        throw new CustomError("Something went wrong", 400);
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    user.password = undefined;

    const token = user.getJwtToken();
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        success: true,
        user
    });
});

/***************************************************
 * @UPDATE_PASSWORD
 * @route http://localhost:4000/api/auth/password/update/id
 * @description User update password controller for update the old password
 * @parameters Old password and new password
 * @return Success message
 ************************************************/

export const updatePassword = asyncHandler(async(req, res) => {
    const {id} = req.params;
    if (!id){
        throw new CustomError("Id is required", 400);
    }

    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword){
        throw new CustomError("Old or new password are required", 400);
    }

    if (oldPassword === newPassword){
        throw new CustomError("Both password are password", 400);
    }

    const user = await User.findById(id).select("+password");

    if (!user){
        throw new CustomError("User not found", 400);
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
 * @GET_PROFILE
 * @route https://localhost:4000/api/auth/profile
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