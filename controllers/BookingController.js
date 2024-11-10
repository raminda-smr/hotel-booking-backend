import Booking from "../models/Booking.js"
import { authenticateAdmin, authenticateCustomer } from '../helpers/Authenticate.js'

export function createBooking(req, res) {

    const authenticated =  authenticateCustomer(req, res, "You must login as a customer to create a booking!")
    if(!authenticated){
        return // stop processing
    }

    let startingId = 1201

    Booking.countDocuments({}).then(
        (count) => {
            if (count != null) {
                // Get next booking id
                let newCount = count + startingId;

                const newBooking = new Booking({
                    bookingId: newCount,
                    roomId: req.body.roomId,
                    email: req.user.email,
                    phone: req.body.phone,
                    start: req.body.start,
                    end: req.body.end
                })

                newBooking.save().then(
                    (result) => {
                        res.json({
                            message: "Booking created successfully",
                            result: result
                        })
                    }
                ).catch(
                    (err) => {
                        res.json({
                            message: "Booking creation failed",
                            error: err
                        })
                    }
                )

            }
        }
    )

}

export function getBookings(req, res) {

    Booking.find().then(
        (list) => {
            res.json({
                list: list
            })
        }
    )

}


export function updateBooking(req, res) {

    const authenticated = authenticateAdmin(req, res, "You must login as a admin to update a booking!")
    if(!authenticated){
        return // stop processing
    }

    const bookingId = req.params.bookingId

    let booking = req.body

    booking.bookingId = bookingId

    Booking.findOneAndUpdate({ bookingId: bookingId }, booking).then(
        (result) => {
            if (result) {
                res.json({
                    message: "Booking item updated",
                    result: result
                })
            }
            else {
                res.status(500).json({
                    message: "Booking item notfound"
                })
            }
        }
    ).catch(
        (err) => {
            if (err) {
                res.status(500).json({
                    message: "Booking item update failed",
                    error: err
                })
            }
        }
    )

}



export function deleteBooking(req, res) {
    const authenticated = authenticateAdmin(req, res, "You must login as a admin to update a booking!")
    if(!authenticated){
        return // stop processing
    }

    const bookingId = req.params.bookingId

    const booking = {
        status: "deleted"
    }

    Booking.findOneAndUpdate({ bookingId: bookingId }, booking).then(
        (result) => {
            if (result) {
                res.json({
                    message: "Booking item deleted",
                    result: result
                })
            }
            else {
                res.status(500).json({
                    message: "Booking item notfound"
                })
            }
        }
    ).catch(
        (err) => {
            if (err) {
                res.status(500).json({
                    message: "Booking item delete failed",
                    error: err
                })
            }
        }
    )

}


export function getBookingById(req, res) {

    const authenticated = authenticateAdmin(req, res, "You must login as a admin to read a booking!")
    if(!authenticated){
        return // stop processing
    }
    
    const bookingId = req.params.bookingId

    Booking.findOne({ bookingId: bookingId }).then(
        (booking) => {
            if (booking) {
                res.json({
                    message: "Booking found",
                    booking: booking
                })
            }
        }
    ).catch(
        (err) =>{
            if(err){
                res.status(500).json({
                    message: "Booking not found",
                    booking: err
                })
            }
        }
    )

}