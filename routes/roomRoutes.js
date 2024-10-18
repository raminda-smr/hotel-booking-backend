import expres from "express"
import { getRooms, createRoom, getRoomByNumber, addRoomImages, deleteRoom, updateRoom } from "../controllers/RoomController.js"


let roomRoutes = expres.Router()


roomRoutes.get('/', getRooms)

roomRoutes.post('/', createRoom)

roomRoutes.get('/room-number/:room', getRoomByNumber)

roomRoutes.put('/room-number/:room', updateRoom)

roomRoutes.delete('/room-number/:room', deleteRoom)

roomRoutes.post('/room-number/:room/images', addRoomImages)


export default roomRoutes