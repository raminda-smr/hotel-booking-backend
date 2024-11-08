import express from "express"
import {getUsers, postUsers, putUser, deleteUser, loginUser, getUser, checkEmailExist} from '../controllers/UserController.js'

let userRoutes = express.Router()

userRoutes.get('/', getUsers)

userRoutes.post('/', postUsers)

userRoutes.put('/:email', putUser)

userRoutes.delete('/', deleteUser)

userRoutes.post('/login', loginUser)

userRoutes.get('/logged', getUser)

userRoutes.get('/check-email-exist/:email', checkEmailExist)

export default userRoutes