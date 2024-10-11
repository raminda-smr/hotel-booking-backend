import mongoose from "mongoose"

const RoomImageSchema = mongoose.Schema({

    roomNumber: {
        type:Number,
        required: true,
        min: 1,
    },
    title: {
        type: String
    },
    image: {
        type: String,
        required: true
    }
    
})

const RoomImage = mongoose.model('RoomImages', RoomImageSchema)


export default RoomImage

