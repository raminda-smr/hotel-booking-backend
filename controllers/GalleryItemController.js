import GalleryItem from "../models/GalleryItem.js";
import { authenticateAdmin } from "../helpers/Authenticate.js";

export function createGalleryItem(req, res) {

    authenticateAdmin(req, res, "You don't have permission to create gallery item")

    const galleryItem = req.body

    const newGalleryItem = new GalleryItem(galleryItem)

    newGalleryItem.save().then(
        () => {
            res.json({
                "message": "Gallery Item Created"
            })
        }
    ).catch(
        () => {
            res.status(500).json({
                "message": "Gallery item creation failed"
            })
        }
    )

}


export function getGalleryItems(req, res) {

    GalleryItem.find().then(
        (list) => {
            res.json({
                list: list
            })
        }
    )
}