import express from "express";
import {
    signUp,
    verifyUser,
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

router.post("/signup", isLoggedOut, signUp);
router.put("/user/verify/:id", isLoggedOut, verifyUser);
router.post("/login", isLoggedOut, logIn);
router.get("/logout",isLoggedIn, logOut);
router.put("/password/forgot", isLoggedOut, forgotPassword);
router.put("/password/reset/:resetToken", isLoggedOut, resetPassword);
router.put("/password/update/:id",isLoggedIn, updatePassword);
router.put("/username/update/:id",isLoggedIn, updateName);
router.get("/profile",isLoggedIn, getProfile);

export default router;