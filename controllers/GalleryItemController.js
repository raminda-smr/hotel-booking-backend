import GalleryItem from "../models/GalleryItem.js";
import { authenticateAdmin } from "../helpers/Authenticate.js";

export function createGalleryItem(req, res) {

    const authenticated = authenticateAdmin(req, res, "You don't have permission to create gallery item")
    if(!authenticated){
        return // stop processing
    }

    const galleryItem = req.body
    // console.log(galleryItem)

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

export function updateGalleryItem(req, res){
    const authenticated = authenticateAdmin(req, res, "You don't have permission to update a gallery item")
    if(!authenticated){
        return // stop processing
    }

    const id = req.params.id
    const galleryItem = req.body

    GalleryItem.findOneAndUpdate({_id:id},galleryItem ).then(
        (result) => {
            if(result){
                res.json({
                    "message": "Gallery item updated!",
                })
            }
            
        }
    ).catch(
        (err) => {
            if(err != undefined){
                res.json({
                    "message": "Gallery item update failed!",
                })
            }
        }
    )


}


export function deleteGalleryItem(req, res){
    
    const authenticated = authenticateAdmin(req, res, "You don't have permission to delete a gallery item")
    if(!authenticated){
        return // stop processing
    }

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