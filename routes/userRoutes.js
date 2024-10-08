import express from "express"
import {getUsers, postUsers, putUser, deleteUser} from '../controllers/UserController.js'

let userRoutes = express.Router()

userRoutes.get('/', getUsers)

userRoutes.post('/', postUsers)

userRoutes.put('/', putUser)

userRoutes.delete('/', deleteUser)


export default userRoutes