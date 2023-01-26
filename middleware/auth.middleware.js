import User from "../models/user.schema.js";
import Jwt from "jsonwebtoken";
import asyncHandler from "../helpers/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import config from "../config/config.js";

export const isLoggedIn = asyncHandler(async(req, _res, next) => {
    let token;

    if (req.cookies.token){
        token = req.cookies.token
    }

    if (!token){
        throw new CustomError("Not authorized to access this route", 401);
    }
    
    try {
        const decodedJwtPayload = Jwt.verify(token, config.JWT_SECRET);
        req.user = await User.findById(decodedJwtPayload._id, "name email");
        next();
    }
    catch (error) {
        throw new CustomError("Not authorized to access this route", 401);
    }
});

export const isLoggedOut = asyncHandler(async(req, _res, next) => {
    if (req.cookies.token){
        throw new CustomError("Already logged In", 400);
    }
    else{
        next();
    }
});