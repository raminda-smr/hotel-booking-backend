import GalleryItem from "../models/GalleryItem.js";

export function createGalleryItem(req, res) {

    const user = req.user

    if(user == null){
        res.status(403).json({
            message: 'Please login to continue'
        })
        return
    }
    if(user.type != 'admin'){
        res.status(403).json({
            message: 'You do not have permission to '
        })
        return
    }
    
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