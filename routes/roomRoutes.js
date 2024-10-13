import expres from "express"
import { getRooms, createRoom, getRoomByNumber, createRoomImages, deleteRoom } from "../controllers/RoomController.js"


let roomRoutes = expres.Router()


roomRoutes.get('/', getRooms)

roomRoutes.post('/', createRoom)

roomRoutes.get('/roomNumber/:roomNumber', getRoomByNumber)

roomRoutes.delete('/roomNumber/:roomNumber', deleteRoom)

roomRoutes.post('/roomNumber/:roomNumber/images', createRoomImages)


export default roomRoutes