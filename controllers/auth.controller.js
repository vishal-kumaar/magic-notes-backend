import User from "../models/user.schema";
import asyncHandler from "../helpers/asyncHandler";
import CustomError from "../utils/CustomError"
import cookieOptions from "../../../Mega_Project/utils/cookieOptions";
import mailSender from "../utils/mailSender";
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

export const logIn = asyncHandler(async (res, req) => {
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

export const logOut = asyncHandler(async(req, res) => {
    res.cookie("token", null, {
        expires: new Date.now(),
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

    const resetToken = user.generateForgotPasswordToken();
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
 * @return Success message
 ************************************************/

export const resetPassword = asyncHandler(async(req, res) => {
    const {resetToken} = req.params;
    
    if (!resetToken){
        throw new CustomError("Reset token is required", 400);
    }

    const resetPasswordToken = crypto.createHash("sha265").update(resetToken).digest("hex");
    
    const {password, confirmPassword} = req.body;

    if (!password || !confirmPassword){
        throw new CustomError("Password or confirm are required", 400);
    }

    if (password !== confirmPassword){
        throw new CustomError("Confirm password must be same as the password", 400);
    }

    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: {$gt: new Date.now()},
    });

    if (!user){
        throw new CustomError("Something went wrong", 400);
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    user.save({validateBeforeSave: true});

    user.password = undefined;

    const token = user.getJwtToken();
    res.cookies("token", token, cookieOptions);

    res.status(200).json({
        success: true,
        user
    });
});