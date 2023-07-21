import User from "../models/user.schema.js";
import Jwt from "jsonwebtoken";
import asyncHandler from "../helpers/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import config from "../config/config.js";

export const isLoggedIn = asyncHandler(async(req, _res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token){
        throw new CustomError("Not authorized to access this route", 401);
    }
    
    try {
        const decodedJwtPayload = Jwt.verify(token, config.JWT_SECRET);
        req.user = await User.findById(decodedJwtPayload._id, "name email");
        next();
    }
    catch (error) {
        throw new CustomError("Session expired! Login to continue", 401);
    }
});

export const isAuthor = asyncHandler(async(req, _res, next) => {
    const {user} = req;
    const {noteId} = req.params;

    
    const note = await User.findById(noteId);
    
    if (!note){
        throw new CustomError("Not not found", 404)
    }

    if (!note.user.equals(user._id)){
        throw new CustomError("You are not the author of this note", 403)
    }
    
    next();
});