import express from "express"
import {getUsers, postUsers, putUser, deleteUser, loginUser, getUser} from '../controllers/UserController.js'

let userRoutes = express.Router()

userRoutes.get('/', getUsers)

userRoutes.post('/', postUsers)

userRoutes.put('/', putUser)

userRoutes.delete('/', deleteUser)

userRoutes.post('/login', loginUser)

userRoutes.get('/logged', getUser)

export default userRoutes