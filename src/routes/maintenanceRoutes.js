import express from "express";
import {
  listLogs,
  newLogForm,
  createLog,
  editLogForm,
  updateLog,
  deleteLog,
} from "../controllers/maintenanceController.js";

const router = express.Router();

router.get("/items/:itemId/maintenance", listLogs);
router.get("/items/:itemId/maintenance/new", newLogForm);

router.post("/items/:itemId/maintenance", createLog);
router.get("/maintenance/:id/edit", editLogForm);

router.post("/maintenance/:id/update", updateLog);

router.post("/maintenance/:id/delete", deleteLog);

export default router;
