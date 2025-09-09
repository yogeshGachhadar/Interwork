import { Router } from "express";
import { createNote, deleteNote, getNotes, getSingleNote, updateNote } from "../controller/noteController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import errorHandler from "../services/errorHandler.js";

const router = Router();

router.route("/create").post(isAuthenticated, errorHandler(createNote));
router.route("/getAll").get(isAuthenticated, errorHandler(getNotes));
router.route("/:id").get(isAuthenticated, errorHandler(getSingleNote));
router.route("/update/:id").patch(isAuthenticated, errorHandler(updateNote));
router.route("/delete/:id").delete(isAuthenticated, errorHandler(deleteNote));

export default router;
