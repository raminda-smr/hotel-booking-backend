import express from "express"
import { createBooking, getBookings, updateBooking } from "../controllers/BookingController.js"
let bookingRoutes = express.Router()


bookingRoutes.post("/", createBooking)

bookingRoutes.get("/", getBookings)

bookingRoutes.put("/:bookingId", updateBooking)


export default bookingRoutes