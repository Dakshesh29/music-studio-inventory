import { Router } from "express";
import {
  getAllItems,
  showCreateForm,
  createItem,
  showEditForm,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";

const router = Router();

router.get("/", getAllItems);
router.get("/new", showCreateForm);
router.post("/", createItem);
router.get("/:id/edit", showEditForm);
router.post("/:id", updateItem);
router.post("/:id/delete", deleteItem);

export default router;
