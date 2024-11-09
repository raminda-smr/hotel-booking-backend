import Booking from "../models/Booking.js";
import Category from "../models/Category.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";
import GalleryItem from "../models/GalleryItem.js";

export function getModuleStats(req, res) {

    const getModuleData = async () => {
        try {
            const bookingCount = await Booking.countDocuments();
            const categoriesCount = await Category.countDocuments();
            const roomsCount = await Room.countDocuments();
            const customersCount = await User.countDocuments({ "type": "customer" });
            const adminsCount = await User.countDocuments({ "type": "admin" });
            const feedbacksCount = await Feedback.countDocuments();
            const galleryItemsCount = await GalleryItem.countDocuments();

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
            res.json(count);
        })
        .catch((error) => {
            res.status(500).json({ error: "Error fetching module data" });
        });
}