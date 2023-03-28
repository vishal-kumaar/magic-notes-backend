import Note from "../models/note.schema.js";
import asyncHander from "../helpers/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import sortByDate from "../utils/sortByTime.js";

/***************************************************
 * @CREATE_NOTE
 * @METHOD POST
 * @route /api/note/createNote
 * @description User create note controller for creating a new note
 * @parameters user object, title and body
 * @return Note Object
 ************************************************/

export const createNote = asyncHander(async(req, res) => {
    const {title, body} = req.body;
    if (!title && !body){
        throw new CustomError("Title/note are required", 400);
    }

    const note = await Note.create({
        title,
        body: body,
        user: req.user._id,
    });

    if (!note){
       throw new CustomError("Server error! Try again", 500); 
    }

    res.status(200).json({
        success: true,
        note
    });
});

/***************************************************
 * @EDIT_NOTE
 * @METHOD PUT
 * @route /api/note/editNote/:noteId
 * @description User edit note controller for editing existing note
 * @parameters note id, title, content
 * @return Note Object
 ************************************************/

export const editNote = asyncHander(async(req, res) => {
    const {noteId} = req.params;
    if (!noteId){
        throw new CustomError("Note Id is required", 400);
    }

    const {title, body} = req.body;
    if (!title) {
        throw new CustomError("Title is required", 400);
    }

    const note = await Note.findById(noteId);
    if (!note){
        throw new CustomError("Note not found", 404);
    }

    note.title = title;
    note.body = body;

    await note.save();

    res.status(200).json({
        success: true,
        note
    });
});

/***************************************************
 * @CHECK_NOTE
 * @METHOD PUT
 * @route /api/note/checkNote/:noteId
 * @description User check note controller for checking the existing note
 * @parameters Note id
 * @return Note Object
 ************************************************/

export const checkNote = asyncHander(async(req, res) => {
    const {noteId} = req.params;
    if (!noteId){
        throw new CustomError("Note Id is required", 400);
    }

    const note = await Note.findById(noteId);
    if (!note){
        throw new CustomError("Note is not found", 404);
    }

    if (note.checked){
        note.checked = false;
    }
    else{
        note.checked = true;
    }

    await note.save();

    res.status(200).json({
        succes: true,
        note
    })
});

/***************************************************
 * @GET_NOTE
 * @METHOD GET
 * @route /api/note/getNote/:noteId
 * @description Get note controller to get the required note
 * @parameters note id
 * @return Note object
 ************************************************/

export const getNote = asyncHander(async(req, res) => {
    const {noteId} = req.params;
    if (!noteId){
        throw new CustomError("Note id is required", 400);
    }

    const note = await Note.findById(noteId);
    if (!note){
        throw new CustomError("Note is not found", 404);
    }

    res.status(200).json({
        success: true,
        note
    })
});

/***************************************************
 * @GET_ALL_NOTES
 * @METHOD GET
 * @route /api/note/getNotes
 * @description User get all the notes controller
 * @parameters user id
 * @return Notes Object
************************************************/

export const getAllNotes = asyncHander(async(req, res) => {
    const notes = await Note.find({user: req.user._id});
    if (notes.length === 0){
        throw new CustomError("Notes not found", 404);
    }

    res.status(200).json({
        success: true,
        notes: notes.sort(sortByDate)
    });
});

/***************************************************
 * @SEARCH_NOTES
 * @METHOD GET
 * @route /api/note/search
 * @description Search note controller to search note
 * @parameters User input
 * @return Note object
 ************************************************/

export const searchNotes = asyncHander(async(req, res) => {
    const {input} = req.query;

    const notes = await Note.find({ 
        $or:[
            {
                $and:[
                    {'title':  new RegExp(input, "i") },
                    {user: req.user._id}
                ]
            },
            {
                $and:[
                    {'body' : new RegExp(input, "i")},
                    {user: req.user._id}
                ]
                
            }
        ]
    });

    if (notes.length === 0){
        throw new CustomError("Notes is not found", 404)
    }

    res.status(200).json({
        success: true,
        notes: notes.reverse()
    })
});

/***************************************************
 * @DELETE_NOTE
 * @METHOD DELETE
 * @route /api/note/deleteNote/:noteId
 * @description User delete note controller for deleting the exisiting note
 * @parameters note id
 * @return Success message and note object
 ************************************************/

export const deleteNote = asyncHander(async(req, res) => {
    const {noteId} = req.params;
    if (!noteId){
        throw new CustomError("Note id is required", 400);
    }

    const note = await Note.findByIdAndDelete(noteId);
    if (!note){
        throw new CustomError("Note is not found", 404);
    }

    res.status(200).json({
        succes: true,
        messase: "Note deleted successfully",
        note
    })
});