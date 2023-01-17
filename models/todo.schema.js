import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [50, "Title must be at most 50 characters"],
        trim: true,
    },
    task: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
{
    timestamps: true,
});

export default mongoose.model("Todo", todoSchema);