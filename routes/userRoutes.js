import express from "express"
import {postUsers} from '../controllers/UserController.js'

let userRoutes = express.Router()

userRoutes.post('/', postUsers)


export default userRoutes