import Room from "../models/Room.js"
import RoomImage from "../models/RoomImage.js";
import { authenticateAdmin } from "../helpers/Authenticate.js";

export function createRoom(req, res) {

    authenticateAdmin(req, res, "You don't have permission to create a room")

    const room = req.body

    const newRoom = new Room(room)

    newRoom.save().then(
        (result) => {
            if (result != null) {


                res.json({
                    "message": "Room Created"
                })
            }
        }
    ).catch(
        (err) => {
            // console.log(err)
            res.status(500).json({
                "message": "Room creation failed",
                "error": err
            })
        }
    )

}


export function getRooms(req, res) {

    Room.find().then(
        (list) => {
            res.json({
                list: list
            })
        }
    )
}

export function getRoomByNumber(req, res) {

    const roomNumber = req.params.roomNumber

    Room.findOne({ roomNumber: roomNumber }).populate('images').then(
        (result) => {
            if (result == null) {
                res.json({
                    "message": "Room not found"
                })
            }
            else {
                res.json({
                    room: result
                })
            }
            return
        }
    ).then(
        (err) => {
            if (err != undefined) {
                res.json({
                    "message": "Failed to get the room"
                })
            }

        }
    )
}


export function updateRoom(req, res) {

    const room = req.body
    const roomNumber = req.params.roomNumber

    Room.findOneAndUpdate({ roomNumber: roomNumber }, room).then(
        (result) => {
            if (result == null) {
                res.json({
                    "message": "Room not found"
                })
            }
            else {
                res.json({
                    room: result
                })
            }
            return
        }
    ).then(
        (err) => {
            if (err != undefined) {
                res.status(500).json({
                    "message": "Failed to update the room",
                    "error":err
                })
            }

        }
    )
}


export function deleteRoom(req, res) {

    const roomNumber = req.params.roomNumber

    Room.findOneAndDelete({ roomNumber: roomNumber }).then(
        (result) => {
            res.json({
                "message": "Room deleted"
            })
        }
    ).then(
        (err) => {
            if (err != undefined) {
                res.status(500).json({
                    "message": "Failed to delete the room",
                    "error":err
                })
            }

        }
    )
}




export function createRoomImages(req, res) {

    authenticateAdmin(req, res, "You don't have permission to create room images")

    const roomImage = req.body
    const roomNumber = req.params.roomNumber

    let room = null

    Room.findOne({ roomNumber: roomNumber })
        .then(
            foundRoom => {
                if (foundRoom != null) {

                    // If multiple images are sent
                    if (Array.isArray(roomImage.image)) {
                        roomImage.image.forEach(element => {
                            const newRoomImage = new RoomImage({ "image": element, "roomId": foundRoom._id })
                            newRoomImage.save()
                        });

                        res.json({
                            "message": "Room images created"
                        })
                    }
                    else if (typeof roomImage.image == "string" && roomImage.image.length > 3) {
                        roomImage.roomId = foundRoom._id

                        const newRoomImage = new RoomImage(roomImage)
                        newRoomImage.save().then(
                            (result) => {
                                if (result == null) {
                                    res.json({
                                        "message": "Room images not created"
                                    })
                                }
                                else {
                                    res.json({
                                        roomImage: result
                                    })
                                }
                                return
                            }
                        ).then(
                            (err) => {
                                if (err != undefined) {
                                    res.json({
                                        "message": "Room images not created",
                                        "error": err
                                    })
                                }

                            }
                        )
                    }
                }
            }
        )
        .catch(
            (err) => {
                if (err != undefined) {
                    res.json({
                        "message": "Room  not created",
                        "error": err
                    })
                }

            }
        )
}


