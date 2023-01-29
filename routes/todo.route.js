import express from "express";
import {
    getAllTodos,
    createTodo,
    checkTask,
    getTodo,
    editTodo,
    deleteTodo
} from "../controllers/todo.controller.js";
import {isLoggedIn} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/api/todo", isLoggedIn, getAllTodos);
router.put("/api/todo/getTodo/:todoId",isLoggedIn, getTodo);
router.post("/api/todo/createTodo",isLoggedIn, createTodo);
router.put("/api/todo/checkTodo/:todoId",isLoggedIn, checkTask);
router.put("/api/todo/editTodo/:todoId",isLoggedIn, editTodo);
router.delete("/api/todo/deleteTodo/:todoId",isLoggedIn, deleteTodo);

export default router;