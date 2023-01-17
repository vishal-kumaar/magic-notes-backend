import express from "express";
import {
    signUp,
    logIn,
    logOut,
    updatePassword,
    resetPassword,
    forgotPassword,
    getProfile
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/api/auth/signup", signUp);
router.get("/api/auth/logIn", logIn);
router.get("/api/auth/logOut", logOut);
router.put("/api/auth/password/forgot", forgotPassword);
router.put("/api/auth/password/reset/:resetToken", resetPassword);
router.put("/api/auth/password/update/:id", updatePassword);
router.put("/api/auth/password/update/:id", updatePassword);
router.get("/api/auth/profile", getProfile);

export default router;