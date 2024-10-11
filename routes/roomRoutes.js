import expres from "express"
import { getRooms,createRoom } from "../controllers/RoomController.js"


let roomRoutes = expres.Router()


roomRoutes.get('/', getRooms)

roomRoutes.post('/', createRoom)


export default roomRoutes