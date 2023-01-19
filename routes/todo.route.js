import express from "express";
import {
    getAllTodos,
    createTodo,
    checkTask,
    editTodoTitle,
    editTask,
    deleteTodo
} from "../controllers/todo.controller.js";
import {isLoggedIn} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/api/todo", isLoggedIn, getAllTodos);
router.post("/api/todo/createTodo",isLoggedIn, createTodo);
router.put("/api/todo/checkTodo/:todoId",isLoggedIn, checkTask);
router.put("/api/todo/editTitle/:todoId",isLoggedIn, editTodoTitle);
router.put("/api/todo/editTask/:todoId",isLoggedIn, editTask);
router.delete("/api/todo/deleteTodo/:todoId",isLoggedIn, deleteTodo);

export default router;