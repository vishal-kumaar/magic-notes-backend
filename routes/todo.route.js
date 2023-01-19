import express from "express";
import {
    getAllTodos,
    createTodo,
    checkTask,
    editTodoTitle,
    editTask,
    deleteTodo
} from "../controllers/todo.controller.js";

const router = express.Router();

router.get("/api/todo", getAllTodos);
router.post("/api/todo/createTodo", createTodo);
router.put("/api/todo/checkTodo/:todoId", checkTask);
router.put("/api/todo/editTitle/:todoId", editTodoTitle);
router.put("/api/todo/editTask/:todoId", editTask);
router.delete("/api/todo/deleteTodo/:todoId", deleteTodo);

export default router;