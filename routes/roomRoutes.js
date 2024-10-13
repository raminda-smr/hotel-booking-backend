import expres from "express"
import { getRooms, createRoom, getRoomByNumber, createRoomImages } from "../controllers/RoomController.js"


let roomRoutes = expres.Router()


roomRoutes.get('/', getRooms)

roomRoutes.post('/', createRoom)

roomRoutes.get('/roomNumber/:roomNumber', getRoomByNumber)

roomRoutes.post('/roomNumber/:roomNumber/images', createRoomImages)


export default roomRoutes