import express from "express"
import { createBookings, deleteBooking, getBookings, updateBooking, getBookingById, getAvailableRooms, getCustomerBookings, getCustomerBookingById } from "../controllers/BookingController.js"
let bookingRoutes = express.Router()

bookingRoutes.get("/", getBookings)

bookingRoutes.post("/", createBookings)

bookingRoutes.post("/get-available-rooms", getAvailableRooms)

bookingRoutes.get("/customer/byId/:bookingId", getCustomerBookingById)

bookingRoutes.get("/customer/:type", getCustomerBookings)

bookingRoutes.get("/:bookingId", getBookingById)

bookingRoutes.put("/:bookingId", updateBooking)

bookingRoutes.delete("/:bookingId", deleteBooking)


export default bookingRoutes