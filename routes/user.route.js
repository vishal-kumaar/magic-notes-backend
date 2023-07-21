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
import {isLoggedIn} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.put("/user/verify/:id", verifyUser);
router.post("/login", logIn);
router.get("/logout", logOut);
router.put("/password/forgot", forgotPassword);
router.put("/password/reset/:resetToken", resetPassword);
router.put("/password/update/:id",isLoggedIn, updatePassword);
router.put("/username/update/:id",isLoggedIn, updateName);
router.get("/profile",isLoggedIn, getProfile);

export default router;