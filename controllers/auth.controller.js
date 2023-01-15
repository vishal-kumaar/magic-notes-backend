import User from "../models/user.schema";
import asyncHandler from "../helpers/asyncHandler";
import CustomError from "../utils/CustomError"
import cookieOptions from "../../../Mega_Project/utils/cookieOptions";
import user from "../../../Full Auth System/model/user";

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
 * @description User login controller for login an existing new user
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