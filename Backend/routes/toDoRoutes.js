import { Router } from "express";
import { createTodo, deleteTodo, getTodo, searchTodo, singleTodo, updateTodo } from "../controller/toDoController.js";
import { isAuthenticated, restrictTo, Role } from "../middleware/authMiddleware.js";
import errorHandler from "../services/errorHandler.js";

const router=Router();

router.route("/create").post(isAuthenticated,restrictTo(Role.User), errorHandler(createTodo));

router.route("/getAll").get(isAuthenticated, errorHandler(getTodo));
router.route("/:id").get(isAuthenticated, errorHandler(singleTodo));

router.route("/update/:id").patch(isAuthenticated, updateTodo);  
router.route("/delete/:id").delete(isAuthenticated, deleteTodo);

router.route("/all/search").get(isAuthenticated, searchTodo);


export default router
