import mongoose from "mongoose"

const RoomSchema = mongoose.Schema({

    roomNumber: {
        type:String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    maxGuests: {
        type: Number,
        required: true,
        min: 1
    },
    disabled: {
        type: Boolean,
        required: true,
        default: false
    }
})

const Room = mongoose.model('Rooms', RoomSchema)


export default Room

