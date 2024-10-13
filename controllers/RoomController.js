import Room from "../models/Room.js"
import { authenticateAdmin } from "../helpers/Authenticate.js";

export function createRoom(req, res) {

    //authenticateAdmin(req, res, "You don't have permission to create a room")

    const room = req.body

    const newRoom = new Room(room)

    newRoom.save().then(
        () => {
            // console.log('saved')
            res.json({
                "message": "Room Created"
            })
            return
        }
    ).catch(
        (err) => {
            // console.log(err)
            res.status(500).json({
                "message": "Room creation failed"
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

export function getRoomByNumber(req, res){

    const roomNumber = req.params.roomNumber

    Room.findOne({roomNumber: roomNumber}).then(
        (result)=>{
            if(result == null){
                res.json({
                    "message":"Room not found" 
                })
            }
            else{
                res.json({
                    room: result
                })
            }
            return
        }
    ).then(
        (err)=>{
            if(err != undefined){
                res.json({
                    "message" : "Failed to get the room"
                })
            }
            
        }
    )


}