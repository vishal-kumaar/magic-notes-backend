import mongoose from "mongoose";

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

export default mongoose.model("User", userSchema);