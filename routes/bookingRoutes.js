import express from "express"
import { createBooking } from "../controllers/BookingController.js"
let bookingRoutes = express.Router()


bookingRoutes.post("/", createBooking)


export default bookingRoutes