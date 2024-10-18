import mongoose from "mongoose"

const BookingSchema = mongoose.Schema({
    bookingId:{
        type: Number,
        required: true,
        unique: true,
    },
    roomId:{
        type: Number,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    phone: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        required: true,
        default:"pending"
    },
    reason:{
        type: String,
        default:""
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    note:{
        type: String,
        default: ""
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
   
})

const Booking = mongoose.model("Bookings", BookingSchema)

export default Booking