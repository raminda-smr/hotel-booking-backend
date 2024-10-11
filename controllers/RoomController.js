import Room from "../models/Room.js"
import { authenticateAdmin } from "../helpers/Authenticate.js";

export function createRoom(req, res) {

    authenticateAdmin(req, res, "You don't have permission to create a room")

    const room = req.body

    const newRoom = new Room(room)

    newRoom.save().then(
        () => {
            res.json({
                "message": "Room Created"
            })
        }
    ).catch(
        () => {
            res.status(500).json({
                "message": "Room creation failed"
            })
        }
    )

}


export function getRooms(req, res) {


}