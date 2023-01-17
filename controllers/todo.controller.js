import Todo from "../models/todo.schema";
import asyncHander from "../helpers/asyncHandler";
import CustomError from "../utils/CustomError";

/***************************************************
 * @CREATE_TODO
 * @route http://localhost:4000/api/todo/createTodo
 * @description User create todo controller for creating a new todo
 * @parameters user object, title and task
 * @return Todo Object
 ************************************************/

export const createTodo = asyncHander(async(req, res) => {
    const {user} = req;
    if (!user){
        throw new CustomError("User not found", 400);
    }

    const {title, task} = req.body;
    if (!title || !task){
        throw new CustomError("Title or task are required", 400);
    }

    const todo = await Todo.create({
        title,
        task,
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
 * @EDIT_TASK
 * @route http://localhost:4000/api/todo/editTask/:id
 * @description User edit task controller for editing existing task in todo
 * @parameters todo id and task
 * @return Todo Object
 ************************************************/

export const editTask = asyncHander(async(req, res) => {
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

    todo.task = task;
    await todo.save({validateBeforeSave: true});

    res.status(200).json({
        success: true,
        todo
    });
});

/***************************************************
 * @CHECK_TASK
 * @route http://localhost:4000/api/todo/checkTodo/:id
 * @description User check task controller for checking the existing task in todo
 * @parameters todo id
 * @return Todo Object
 ************************************************/

export const checkTask = asyncHander(async(req, res) => {
    const {id} = req.params;
    if (!id){
        throw new CustomError("Todo id is required", 400);
    }

    const todo = await Todo.findOne({id});
    if (!todo){
        throw new CustomError("Todo is not found", 400);
    }

    if (todo.checked){
        todo.checked = false;
    }
    else{
        todo.checked = true;
    }

    await todo.save({validateBeforeSave: true});

    res.status(200).json({
        succes: true,
        todo
    })
});