import express from "express"
import { createBooking, getBookings } from "../controllers/BookingController.js"
let bookingRoutes = express.Router()


bookingRoutes.post("/", createBooking)

bookingRoutes.get("/", getBookings)


export default bookingRoutes