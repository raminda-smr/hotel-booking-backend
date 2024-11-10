import Booking from "../models/Booking.js"
import Category from "../models/Category.js"
import Room from "../models/Room.js"
import User from "../models/User.js"
import Feedback from "../models/Feedback.js"
import GalleryItem from "../models/GalleryItem.js"
import { authenticateAdmin } from "../helpers/Authenticate.js"


export function getModuleStats(req, res) {
    
    const authenticated = authenticateAdmin(req, res, "You must login as a admin to get module data!")
    if(!authenticated){
        return // stop processing
    }

    const getModuleData = async () => {
        try {
            const bookingCount = await Booking.countDocuments()
            const categoriesCount = await Category.countDocuments()
            const roomsCount = await Room.countDocuments()
            const customersCount = await User.countDocuments({ "type": "customer" })
            const adminsCount = await User.countDocuments({ "type": "admin" })
            const feedbacksCount = await Feedback.countDocuments()
            const galleryItemsCount = await GalleryItem.countDocuments()

            return {
                bookingCount: bookingCount,
                categoriesCount: categoriesCount,
                roomsCount: roomsCount,
                customersCount: customersCount,
                adminsCount: adminsCount,
                feedbacksCount: feedbacksCount,
                galleryItemsCount: galleryItemsCount
            }
        } catch (e) {
            console.error("Error getting count: ", e)
            throw e
        }
    }

    getModuleData()
        .then((count) => {
            if(count){
                res.json(count)
            }
        })
        .catch((error) => {
            if(error){
                res.status(500).json({ error: "Error fetching module data" })
            }
        });
}

export function getDashboardBookingStats(req, res) {

    const authenticated = authenticateAdmin(req, res, "You must login as a admin to get dashboard data!")
    if(!authenticated){
        return // stop processing
    }

    const getDashboardBookingData = async () => {

        let today = new Date()

        // remove time offset  
        today = new Date(today.getTime() - (process.env.TIME_OFFSET * 60 * 1000))

        let tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);

        // get date strings
        today = today.toISOString().split('T')[0]
        tomorrow = tomorrow.toISOString().split('T')[0]
        dayAfterTomorrow = dayAfterTomorrow.toISOString().split('T')[0]

        try {

            const todaysBookingsCount = await Booking.countDocuments({
                start: { $gt: new Date(today) },
                end: { $lt: new Date(tomorrow) },
                status: { $nin: ["canceled", "deleted", "refunded"] }
            })

            const tomorrowsBookingsCount = await Booking.countDocuments({
                start: { $gt: new Date(tomorrow) },
                end: { $lt: new Date(dayAfterTomorrow) },
                status: { $nin: ["canceled", "deleted", "refunded"] }
            })

            const upcomingBookingsCount = await Booking.countDocuments({
                start: { $gt: new Date(today) }
            })

            const completedBookingsCount = await Booking.countDocuments({
                status: "completed"
            })

            const totaldBookingsCount = await Booking.countDocuments()

            const todaysBookings = await Booking.find({
                start: { $gt: new Date(today) },
                end: { $lt: new Date(tomorrow) },
                status: { $nin: ["canceled", "deleted", "refunded"] }
            }).limit(2)

            const tomorrowsBookings = await Booking.find({
                start: { $gt: new Date(tomorrow) },
                end: { $lt: new Date(dayAfterTomorrow) },
                status: { $nin: ["canceled", "deleted", "refunded"] }
            }).limit(2)


            return {
                today: today,
                tomorrow: tomorrow,
                dayAfterTomorrow: dayAfterTomorrow,
                todaysBookingsCount: todaysBookingsCount,
                tomorrowsBookingsCount: tomorrowsBookingsCount,
                upcomingBookingsCount: upcomingBookingsCount,
                completedBookingsCount: completedBookingsCount,
                totaldBookingsCount: totaldBookingsCount,
                todaysBookings: todaysBookings,
                tomorrowsBookings: tomorrowsBookings
            }
        } catch (e) {
            console.error("Error getting count: ", e)
            throw e
        }
    }

    getDashboardBookingData()
        .then((data) => {
            if(data){
                res.json(data)
            }
        })
        .catch((error) => {
            if (error) {
                res.status(500).json({ error: "Error fetching module data" })
            }
        });

}