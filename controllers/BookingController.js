import Booking from "../models/Booking.js"
import Room from "../models/Room.js"
import Category from "../models/Category.js"
import { authenticateAdmin, authenticateCustomer } from '../helpers/Authenticate.js'

export function createBooking(req, res) {

    const authenticated = authenticateCustomer(req, res, "You must login as a customer to create a booking!")
    if (!authenticated) {
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

export function createBookings(req, res){
    // loop room list
        // check each room availablity for given date

    // if all rooms are available
        //loop room list
            // add each booking
    
        // send booking email
        // set admin notification
        // send success code to clear the booking

    // else send error with unavailable room message

    res.json(req.body)
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
    if (!authenticated) {
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
    if (!authenticated) {
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
    if (!authenticated) {
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
        (err) => {
            if (err) {
                res.status(500).json({
                    message: "Booking not found",
                    booking: err
                })
            }
        }
    )

}

export function getAvailableRooms(req, res) {

    const { start, end, category } = req.body

    if (!start || !end || !category) {
        return res.status(400).json({ message: "Start date, end date, and category are required." });
    }

    const getAvailableRoomData = async () => {

        try {

            const startDate = new Date(start)
            const endDate = new Date(end)

            const overlappingBookings = await Booking.find({
                $or: [
                    { start: { $lt: endDate }, end: { $gt: startDate } }, // Overlaps partially
                    { start: { $lte: startDate }, end: { $gte: endDate } } // Fully contained
                ]
            });

            const bookedRoomIds = overlappingBookings.map(booking => booking.roomId)

            const rooms = await Room.find({
                category: category,
                disabled: false, // makesure room is not disabled
                roomNumber: { $nin: bookedRoomIds } // exclude booked rooms
            })

            if (rooms.length === 0) {
                return { rooms: [] }
            }

            // get category data from db
            const categoryDetails = await Category.findOne({ name: category });

            if (categoryDetails) {

                const availableRooms = rooms.map(room => ({
                    ...room.toObject(), // Convert Mongoose document to plain object
                    category: categoryDetails
                }))
    
                return { rooms: availableRooms }
            }

            return { rooms: []}
        }
        catch (e) {
            console.error(e)
            throw e
        }

    }

    getAvailableRoomData()
        .then((data) => {
            if (data) {
                res.json(data)
            }
        })
        .catch((error) => {
            if (error) {
                res.status(500).json({ error: "Error fetching data" })
            }
        })
}