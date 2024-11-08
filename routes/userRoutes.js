import express from "express"
import {getUsers, postUsers, putUser, deleteUser, loginUser, getUser, checkEmailExist, changePassword} from '../controllers/UserController.js'

let userRoutes = express.Router()

userRoutes.get('/', getUsers)

userRoutes.post('/', postUsers)

userRoutes.put('/update/:email', putUser)

userRoutes.put('/change-password/:email', changePassword)

userRoutes.delete('/', deleteUser)

userRoutes.post('/login', loginUser)

userRoutes.get('/logged', getUser)

userRoutes.get('/check-email-exist/:email', checkEmailExist)

export default userRoutes