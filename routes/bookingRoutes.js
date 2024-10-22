import express from "express"
import { createBooking, deleteBooking, getBookings, updateBooking } from "../controllers/BookingController.js"
let bookingRoutes = express.Router()


bookingRoutes.post("/", createBooking)

bookingRoutes.get("/", getBookings)

bookingRoutes.put("/:bookingId", updateBooking)

bookingRoutes.delete("/:bookingId", deleteBooking)


export default bookingRoutes