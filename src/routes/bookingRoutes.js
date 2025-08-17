import express from "express";
import bookingController from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", bookingController.listBookings);
router.get("/new", bookingController.newBookingForm);
router.post("/new", bookingController.createBooking);

export default router;
