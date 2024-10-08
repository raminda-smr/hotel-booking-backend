import express from "express"
import {getUsers, postUsers, putUser} from '../controllers/UserController.js'

let userRoutes = express.Router()

userRoutes.get('/', getUsers)

userRoutes.post('/', postUsers)

userRoutes.put('/', putUser)


export default userRoutes