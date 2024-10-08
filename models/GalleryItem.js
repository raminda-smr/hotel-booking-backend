import mongoose from "mongoose"

const GalleryItemSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        image:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        }

    }
)


const GalleryItem = mongoose.model('GalleryItems',GalleryItemSchema )

export default GalleryItem