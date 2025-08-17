import express from "express";
import bookingController from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", bookingController.listBookings);

router.get("/new", bookingController.newBookingForm);

router.post("/new", bookingController.createBooking);

router.get("/:id/edit", bookingController.editBookingForm);
router.post("/:id/edit", bookingController.updateBooking);

router.post("/:id/delete", bookingController.deleteBooking);

export default router;
