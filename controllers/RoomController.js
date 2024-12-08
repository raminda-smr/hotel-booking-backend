import Room from "../models/Room.js"
import { authenticateAdmin } from "../helpers/Authenticate.js";
import config from "../config/config.js";
import { generatePagination } from "../helpers/Paginate.js";

export function createRoom(req, res) {

    const authenticated = authenticateAdmin(req, res, "You don't have permission to create a room")
    if(!authenticated){
        return // stop processing
    }

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
            if (err != undefined) {
                res.status(500).json({
                    "message": "Room creation failed",
                    "error": err
                })
            }

        }
    )

}


export function getRooms(req, res) {

    const perPage = config.pagination.perPage || 10; // Default items per page
    const pageGap = config.pagination.pageGap || 2; // Default page gap
    const currentPage = parseInt(req.query.page) || 1; // Current page from query param

    Room.countDocuments()
        .then(totalItems => {
            const pagination = generatePagination(currentPage, totalItems, perPage, pageGap);

            return Room.find()
                .sort({ roomNumber: -1 })
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .then(list => {
                    res.json({
                        list,
                        pagination
                    })
                })
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to fetch rooms", details: err.message })
        })
   
}

export function getRoomByCategory(req, res) {

    const category = req.params.category

    Room.find({category:category}).then(
        (list) => {
            res.json({
                list: list
            })
        }
    )
}

export function getRoomByNumber(req, res) {

    const roomNumber = req.params.room

    Room.findOne({ roomNumber: roomNumber }).then(
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

    const authenticated = authenticateAdmin(req, res, "You must login as admin to update rooms")
    if(!authenticated){
        return // stop processing
    }

    const room = req.body
    const roomNumber = req.params.room

    room.roomNumber = roomNumber

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
                    "error": err
                })
            }

        }
    )
}


export function deleteRoom(req, res) {

    const authenticated = authenticateAdmin(req, res, "You must login as admin to delete a room")
    if(!authenticated){
        return // stop processing
    }

    const roomNumber = req.params.room

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
                    "error": err
                })
            }

        }
    )
}



export function addRoomImages(req, res) {

    const authenticated = authenticateAdmin(req, res, "You don't have permission to create room images")
    if(!authenticated){
        return // stop processing
    }

    const roomImage = req.body
    const roomNumber = req.params.room

    Room.findOne({ roomNumber: roomNumber })
        .then(
            (foundRoom) => {
                if(!foundRoom){
                    res.json({
                        "message": "Room not found",
                    })
                }
                else{
                    let ImageArray = foundRoom.images

                    console.log(ImageArray)

                    // If multiple images are sent
                    if (Array.isArray(roomImage.image)) {

                        roomImage.image.forEach(newImage => {
                            ImageArray.push(newImage)
                        });
                    }
                    else if (typeof roomImage.image == "string" && roomImage.image.length > 3) {

                        // single image is sent
                        ImageArray.push(roomImage.image)                        
                    }

                    foundRoom.images = ImageArray

                    Room.updateOne({ roomNumber: roomNumber }, foundRoom).then(
                        (updated) => {
                            if (updated) {
                                res.json({
                                    "message": "Room images created"
                                })
                            }
                            else{
                                res.json({
                                    "message": "Room images creation faild"
                                })
                            }
                        }
                    ).catch(
                        (err) =>{
                            if(err != undefined){
                                res.json({
                                    "message": "Room images creation faild",
                                    "error": err
                                })
                            }
                        }
                    )
                }
                
            }
        )
}


