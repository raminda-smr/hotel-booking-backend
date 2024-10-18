import mongoose from "mongoose"

const RoomSchema = mongoose.Schema({

    roomNumber: {
        type: Number,
        required: true,
        unique: true,
        min: 1
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
    },
    images: [{
        type: String
    }],
    notes:{
        type:String,
        default:""
    }
})

const Room = mongoose.model('Rooms', RoomSchema)


export default Room

