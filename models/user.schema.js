import mongoose from "mongoose";
import Jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import config from "../config/config";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [50, "Name must be atmost 50 character"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be atleast 8 character"],
        select: false,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
},
{
    timestamps: true,
});

// Mongoose pre hook for "save"
userSchema.pre("save", async function (next){
    if (this.isModified("password")){
        this.password = await bcryptjs.hash(this.password, 10);
    }
    next();
});

// Mongoose methods
userSchema.methods = {
    comparePassword: async function(enteredPassword){
        return await bcryptjs.compare(enteredPassword, this.password);
    },
    getJwtToken: function(){
        return Jwt.sign({
            _id: this._id,
            email: this.email,
        },
        config.JWT_SECRET,
        {
           expiresIn: config.JWT_EXPIRY, 
        });
    },
    generateForgotPasswordToken: async function(){
        const forgotToken = crypto.randomBytes(20).toString("hex");

        this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest("hex");
        this.forgotPasswordExpiry = Date.now() + 20 + 60 * 1000;

        return forgotToken;
    },
}

export default mongoose.model("User", userSchema);