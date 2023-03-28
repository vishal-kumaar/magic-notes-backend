import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        maxLength: [50, "Title must be at most 50 characters"],
        trim: true,
    },
    body: String,
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

export default mongoose.model("Note", noteSchema);