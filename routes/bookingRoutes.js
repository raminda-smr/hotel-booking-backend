import express from "express"
import { createBookings, deleteBooking, getBookings, updateBooking, getBookingById, getAvailableRooms } from "../controllers/BookingController.js"
let bookingRoutes = express.Router()


bookingRoutes.post("/", createBookings)

bookingRoutes.get("/", getBookings)

bookingRoutes.post("/get-available-rooms", getAvailableRooms)

bookingRoutes.get("/:bookingId", getBookingById)

bookingRoutes.put("/:bookingId", updateBooking)

bookingRoutes.delete("/:bookingId", deleteBooking)


export default bookingRoutes