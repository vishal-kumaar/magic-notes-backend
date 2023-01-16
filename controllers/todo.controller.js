import Todo from "../models/todo.schema";
import asyncHander from "../helpers/asyncHandler";
import CustomError from "../utils/CustomError";

/***************************************************
 * @SIGNUP
 * @route http://localhost:4000/api/todo/createTodo
 * @description User create todo controller for creating a new todo
 * @parameters title and array of tasks
 * @return Todo Object
 ************************************************/

export const createTodo = asyncHander(async(req, res) => {
    const {user} = req;
    if (!user){
        throw new CustomError("User not found", 400);
    }

    const {title, tasks} = req.body;
    if (!title || !tasks){
        throw new CustomError("Title or tasks are required", 400);
    }

    const todo = await Todo.create({
        title,
        tasks,
        user: user._id,
    });

    if (!todo){
       throw new CustomError("Something went wrong", 400); 
    }

    res.status(200).json({
        success: true,
        todo
    });
});