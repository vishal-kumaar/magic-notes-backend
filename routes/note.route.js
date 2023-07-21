import express from "express";
import {
    createNote,
    editNote,
    checkNote,
    getNote,
    getAllNotes,
    searchNotes,
    deleteNote
} from "../controllers/note.controller.js";
import {isLoggedIn, isAuthor} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/createNote",isLoggedIn, createNote);
router.put("/editNote/:noteId",[isLoggedIn, isAuthor], editNote);
router.put("/checkNote/:noteId",[isLoggedIn, isAuthor], checkNote);
router.get("/getNote/:noteId",isLoggedIn, getNote);
router.get("/getNotes", isLoggedIn, getAllNotes);
router.get("/search", isLoggedIn, searchNotes);
router.delete("/deleteNote/:noteId",[isLoggedIn, isAuthor], deleteNote);

export default router;