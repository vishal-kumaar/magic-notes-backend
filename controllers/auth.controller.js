import User from "../models/user.schema";
import asyncHandler from "../helpers/asyncHandler";
import CustomError from "../utils/CustomError"
import cookieOptions from "../../../Mega_Project/utils/cookieOptions";

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

    res.cookie("Token", token, cookieOptions);

    res.status(200).json({
        success: true,
        token,
        user,
    });
});