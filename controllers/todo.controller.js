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

    const {title} = req.body;
    if (!title){
        throw new CustomError("Title is required", 400);
    }

    const todo = await Todo.create({
        title,
        task: "",
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

export const editTodo = asyncHander(async(req, res) => {
    const {todoId} = req.params;
    if (!todoId){
        throw new CustomError("Todo id is required", 400);
    }

    const {title, task} = req.body;
    if (!title) {
        throw new CustomError("Title is required", 400);
    }

    const todo = await Todo.findById(todoId);
    if (!todo){
        throw new CustomError("Todo not found", 400);
    }

    todo.title = title;
    todo.task = task;

    await todo.save();

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

    const todo = await Todo.findById(todoId);
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
    if (todos.length == 0){
        throw new CustomError("Todo not found", 404);
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
        todo
    })
});

/***************************************************
 * @GET_TODO
 * @route http://localhost:4000/api/todo/getTodo/:todoId
 * @description Get todo controller to get the required todo
 * @parameters todo id
 * @return Todo object
 ************************************************/

export const getTodo = asyncHander(async(req, res) => {
    const {todoId} = req.params;
    if (!todoId){
        throw new CustomError("Todo id is required", 400);
    }

    const todo = await Todo.findById(todoId);
    if (!todo){
        throw new CustomError("Todo is not exist", 400);
    }

    res.status(200).json({
        success: true,
        todo
    })
});

/***************************************************
 * @SEARCH_TODO
 * @route http://localhost:4000/api/todo/search
 * @description Search todo controller to search todo
 * @parameters User input
 * @return Todos object
 ************************************************/

export const searchTodo = asyncHander(async(req, res) => {
    const {input} = req.query;
    if (!input){
        throw new CustomError("Input field required", 400);
    }

    const {user} = req;
    const todos = await Todo.find({ 
        $or:[
            {
                $and:[
                    {title:  new RegExp(input, "i") },
                    {user: user._id}
                ]
            },
            {
                $and:[
                    {'task' : new RegExp(input, "i")},
                    {user: user._id}
                ]
                
            }
        ]
    });

    if (todos.length === 0){
        throw new CustomError("Todo not found", 404)
    }

    res.status(200).json({
        success: true,
        todos
    })
});