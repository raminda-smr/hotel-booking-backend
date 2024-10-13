import expres from "express"
import { getRooms, createRoom, getRoomByNumber } from "../controllers/RoomController.js"


let roomRoutes = expres.Router()


roomRoutes.get('/', getRooms)

roomRoutes.post('/', createRoom)

roomRoutes.get('/roomNumber/:roomNumber', getRoomByNumber)


export default roomRoutes