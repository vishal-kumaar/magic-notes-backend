import Todo from "../models/todo.schema";
import asyncHander from "../helpers/asyncHandler";
import CustomError from "../utils/CustomError";

/***************************************************
 * @CREATE_TODO
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

    const {title} = req.body;
    if (!title){
        throw new CustomError("Title are required", 400);
    }

    const todo = await Todo.create({
        title,
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

/***************************************************
 * @ADD_TASK
 * @route http://localhost:4000/api/todo/addTask/:id
 * @description User add task controller for adding task in todo
 * @parameters array of tasks
 * @return Todo Object
 ************************************************/

export const addTask = asyncHander(async(req, res) => {
    const {id} = req.params;
    if (!id){
        throw new CustomError("Todo id is required", 400);
    }

    const {task} = req.body;
    if (!task) {
        throw new CustomError("Task is required", 400);
    }

    const todo = await Todo.findOne({id});
    if (!todo){
        throw new CustomError("Todo not found", 400);
    }

    todo.tasks.push({task});
    await todo.save({validateBeforeSave: true});

    res.status(200).json({
        success: true,
        todo
    });
});