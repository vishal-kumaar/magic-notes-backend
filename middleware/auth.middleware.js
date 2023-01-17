import User from "../models/user.schema";
import Jwt from "jsonwebtoken";
import asyncHandler from "../helpers/asyncHandler";
import CustomError from "../utils/CustomError";
import config from "../config/config";

export const isLoggedIn = asyncHandler(async(req, _res, next) => {
    let token;

    if (req.cookies.token || req.headers.authorization && req.headers.authorization.startWith("Bearer")){
        token = req.cookies.token || req.headers.authorization.split(" ")[1];
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