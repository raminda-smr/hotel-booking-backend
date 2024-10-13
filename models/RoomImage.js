import mongoose from "mongoose"

const RoomImageSchema = mongoose.Schema({

    roomId: {
        type:mongoose.Types.ObjectId,
        required: true,
        ref: "Rooms"
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

