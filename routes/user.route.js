import express from "express";
import {
    signUp,
    logIn,
    logOut,
    updatePassword,
    resetPassword,
    forgotPassword,
    getProfile
} from "../controllers/auth.controller.js";
import {isLoggedIn} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/api/auth/signup", signUp);
router.post("/api/auth/login", logIn);
router.get("/api/auth/logout",isLoggedIn, logOut);
router.put("/api/auth/password/forgot", forgotPassword);
router.put("/api/auth/password/reset/:resetToken", resetPassword);
router.put("/api/auth/password/update/:id",isLoggedIn, updatePassword);
router.get("/api/auth/profile",isLoggedIn, getProfile);

export default router;