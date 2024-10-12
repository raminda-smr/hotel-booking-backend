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


export function deleteGalleryItem(req, res){
    
    authenticateAdmin(req, res, "You don't have permission to delete a gallery item")

    const id = req.params.id

    GalleryItem.findOneAndDelete({_id:id}).then(
        ()=>{
            res.json({
                "message": "Gallery item deleted"
            })
        }
    ).catch(
        (err)=>{
            if(err != undefined){
                res.json({
                    "message": "Gallery item deletation failed"
                })
            }
        }
    )

}