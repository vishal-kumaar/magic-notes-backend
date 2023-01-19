import Todo from "../models/todo.schema.js";
import asyncHander from "../helpers/asyncHandler.js";
import CustomError from "../utils/CustomError.js";

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
 * @route http://localhost:4000/api/todo/editTask/:todoId
 * @description User edit task controller for editing existing task in todo
 * @parameters todo id and task
 * @return Todo Object
 ************************************************/

export const editTask = asyncHander(async(req, res) => {
    const {todoId} = req.params;
    if (!todoId){
        throw new CustomError("Todo id is required", 400);
    }

    const {task} = req.body;
    if (!task) {
        throw new CustomError("Task is required", 400);
    }

    const todo = await Todo.findOne({todoId});
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
 * @route http://localhost:4000/api/todo/checkTodo/:todoId
 * @description User check task controller for checking the existing task in todo
 * @parameters todo id
 * @return Todo Object
 ************************************************/

export const checkTask = asyncHander(async(req, res) => {
    const {todoId} = req.params;
    if (!todoId){
        throw new CustomError("Todo id is required", 400);
    }

    const todo = await Todo.findOne({todoId});
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

/***************************************************
 * @GET_ALL_TASK
 * @route http://localhost:4000/api/todo
 * @description User get all todo controller for getting all the todo
 * @parameters user id
 * @return Todos Object
 ************************************************/

export const getAllTodos = asyncHander(async(req, res) => {
    const {user} = req;
    if (!user){
        throw new CustomError("Not authorized to access this route", 400);
    }

    const userId = user._id;

    const todos = await Todo.find({user: userId});
    if (!todos){
        throw new CustomError("Todo not found", 400);
    }

    res.status(200).json({
        success: true,
        todos
    });
});

/***************************************************
 * @DELETE_TODO
 * @route http://localhost:4000/api/todo/deleteTodo/:todoId
 * @description User delete todo controller for deleting the exisiting todo
 * @parameters todo id
 * @return Success message
 ************************************************/

export const deleteTodo = asyncHander(async(req, res) => {
    const {todoId} = req.params;
    if (!todoId){
        throw new CustomError("Todo id is required", 400);
    }

    const todo = await Todo.findByIdAndDelete(todoId);

    if (!todo){
        throw new CustomError("Todo not exist", 400);
    }

    res.status(200).json({
        succes: true,
        messase: "Todo deleted successfully",
    })
});

/***************************************************
 * @EDIT_TODO_TITLE
 * @route http://localhost:4000/api/todo/editTitle/:todoId
 * @description User edit todo title controller for editing the exisiting todo title
 * @parameters todo id
 * @return Todo object
 ************************************************/

export const editTodoTitle = asyncHander(async(req, res) => {
    const {todoId} = req.params;
    if (!todoId){
        throw new CustomError("Todo id is required", 400);
    }

    const {title} = req.body;
    if (!title){
        throw new CustomError("Title is required", 400);
    }

    const todo = await Todo.findOne({todoId});
    if (!todo){
        throw new CustomError("Todo is not exist", 400);
    }

    todo.title = title;
    await todo.save({validateBeforeSave});

    res.status(200).json({
        success: true,
        todo
    })
});