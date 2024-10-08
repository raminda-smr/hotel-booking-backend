import GalleryItem from "../models/GalleryItem.js";

export function createGalleryItem(req, res) {
    
    const galleryItem = req.body

    console.log(galleryItem)

    const newGalleryItem = new GalleryItem(galleryItem)

    newGalleryItem.save().then(
        () => {
            res.json({
                message: "Gallery Item Created"
            })
        }
    ).catch(
        () => {
            res.status(500).json({
                message: "Gallery item creation failed"
            })
        }
    )

}