import express from "express";
import {
  autoUpdateStatuses,
  listBookings,
  newBookingForm,
  createBooking,
  editBookingForm,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.use(autoUpdateStatuses);

router.get("/", listBookings);
router.get("/new", newBookingForm);
router.post("/new", createBooking);
router.get("/:id/edit", editBookingForm);
router.post("/:id/edit", updateBooking);
router.post("/:id/delete", deleteBooking);

export default router;
