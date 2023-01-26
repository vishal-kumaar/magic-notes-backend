import express from "express";
import {
    signUp,
    logIn,
    logOut,
    updatePassword,
    resetPassword,
    forgotPassword,
    updateName,
    getProfile
} from "../controllers/auth.controller.js";
import {isLoggedIn, isLoggedOut} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/api/auth/signup", isLoggedOut, signUp);
router.post("/api/auth/login", isLoggedOut, logIn);
router.get("/api/auth/logout",isLoggedIn, logOut);
router.put("/api/auth/password/forgot", isLoggedOut, forgotPassword);
router.put("/api/auth/password/reset/:resetToken", isLoggedOut, resetPassword);
router.put("/api/auth/password/update/:id",isLoggedIn, updatePassword);
router.put("/api/auth/username/update/:id",isLoggedIn, updateName);
router.get("/api/auth/profile",isLoggedIn, getProfile);

export default router;