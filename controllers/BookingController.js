import Booking from "../models/Booking.js"
import Room from "../models/Room.js"
import Category from "../models/Category.js"
import { authenticateAdmin, authenticateCustomer } from '../helpers/Authenticate.js'
import config from "../config/config.js"
import { generatePagination } from "../helpers/Paginate.js"

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

export function createBookings(req, res) {
    // Authenticate the customer
    const authenticated = authenticateCustomer(req, res, "You must login as a customer to create a booking!");
    if (!authenticated) {
        return; // Stop processing
    }

    // Extract data from the request body
    const { startDate, endDate, cart } = req.body;
    const user = req.user;

    if (!startDate || !endDate || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: "Invalid booking data!" });
    }

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check room availability
    Booking.find({
        roomId: { $in: cart },
        $or: [
            { start: { $lt: end }, end: { $gt: start } } // Overlapping bookings
        ]
    })
        .then((existingBookings) => {
            if (existingBookings.length > 0) {
                // Find unavailable rooms
                const unavailableRooms = existingBookings.map(booking => booking.roomId);
                return res.status(400).json({
                    error: "Some rooms are not available for the selected dates.",
                    unavailableRooms
                });
            }

            // Generate booking entries
            let startingId = 1201;
            return Booking.countDocuments({})
                .then((count) => {
                    const newBookingId = count + startingId;
                    const bookings = cart.map((roomId, index) => ({
                        bookingId: newBookingId + index,
                        roomId,
                        email: user.email,
                        start,
                        end,
                        status: "pending"
                    }));

                    // Save all bookings
                    return Booking.insertMany(bookings);
                })
                .then((createdBookings) => {
                    // Send booking email (Placeholder)
                    console.log(`Email sent to ${user.email} for bookings:`, createdBookings);

                    // Notify admin (Placeholder)
                    console.log("Admin notified about new bookings:", createdBookings);

                    // Respond with success
                    res.status(201).json({ message: "Booking successful!", bookings: createdBookings });
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "An error occurred while processing the booking." });
        });
}




export function getBookings(req, res) {
    const authenticated = authenticateAdmin(req, res, "You must login as a admin to get bookings list!")
    if (!authenticated) {
        return // stop processing
    }

    const perPage = config.pagination.perPage || 10; // Default items per page
    const pageGap = config.pagination.pageGap || 2; // Default page gap
    const currentPage = parseInt(req.query.page) || 1; // Current page from query param

    Booking.countDocuments()
        .then(totalItems => {
            const pagination = generatePagination(currentPage, totalItems, perPage, pageGap);

            return Booking.find()
                .sort({ bookingId: -1 })
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .then(
                    (list) => {
                        res.json({
                            list,
                            pagination
                        })
                    }
                )
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to get bookings", details: err.message })
        })
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
    // Authenticate admin
    const authenticated = authenticateAdmin(req, res, "You must login as an admin to delete a booking!");
    if (!authenticated) {
        return; // Stop processing
    }

    // Get bookingId from request parameters
    const bookingId = req.params.bookingId;

    // Find and delete the booking
    Booking.findOneAndDelete({ bookingId: bookingId })
        .then((result) => {
            if (result) {
                res.json({
                    message: "Booking item deleted successfully",
                    deletedBooking: result
                });
            } else {
                res.status(404).json({
                    message: "Booking item not found"
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: "Failed to delete the booking item",
                error: err
            });
        });
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

            return { rooms: [] }
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


export function getCustomerBookings(req, res) {
    const authenticated = authenticateCustomer(req, res, "You must login as a customer to get this data")
    if (!authenticated) {
        return
    }

    const loggedUser = req.user
    const { type } = req.params
    let status = "pending"

    const statuses = ['pending', 'approved', 'paid', 'completed', 'canceled']

    if (statuses.includes(type)) {
        status = type
    }

    // Define the query condition
    let queryCondition = { email: loggedUser.email, status };

    // If type is 'approved', modify the condition to include both 'approved' and 'paid'
    if (type === 'approved') {
        queryCondition = {
            email: loggedUser.email,
            status: { $in: ['approved', 'paid'] } // Query for both 'approved' and 'paid'
        };
    }

    Booking.find(queryCondition).then(
        (result) => {
            if (result) {
                // console.log(result)
                res.json({
                    message: "Bookings found",
                    list: result || []
                })
            }
        }
    ).catch(
        (err) => {
            if (err) {
                res.status(500).json({
                    message: err.message
                })
            }

        }
    )

}


export function getCustomerBookingById(req, res) {
    const authenticated = authenticateCustomer(req, res, "You must login as a customer to get this data")
    if (!authenticated) {
        return
    }

    const loggedUser = req.user
    const { bookingId } = req.params

    const queryCondition = { email: loggedUser.email, bookingId };

    Booking.findOne(queryCondition).then(
        (result) => {
            if (result) {
                // console.log(result)
                res.json({
                    message: "Booking found",
                    booking: result
                })
            }
        }
    ).catch(
        (err) => {
            if (err) {
                res.status(500).json({
                    message: err.message
                })
            }

        }
    )

}
