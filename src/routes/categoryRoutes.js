import { Router } from "express";
import {
  getAllCategories,
  showCreateForm,
  createCategory,
  showEditForm,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = Router();

router.get("/", getAllCategories);

router.get("/new", showCreateForm);

router.post("/", createCategory);

router.get("/:id/edit", showEditForm);
router.post("/:id", updateCategory);
router.post("/:id/delete", deleteCategory);

export default router;
