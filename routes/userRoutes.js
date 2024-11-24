import express from "express"
import {getUsers, postUsers, putUser, deleteUser, loginUser, getUser, checkEmailExist, changePassword, registerUser, verifyUser} from '../controllers/UserController.js'

let userRoutes = express.Router()

userRoutes.get('/', getUsers)

userRoutes.post('/', postUsers)

userRoutes.post('/register', registerUser)

userRoutes.put('/update/:email', putUser)

userRoutes.put('/change-password/:email', changePassword)

userRoutes.delete('/:email', deleteUser)

userRoutes.post('/login', loginUser)

userRoutes.get('/logged', getUser)

userRoutes.get('/check-email-exist/:email', checkEmailExist)

userRoutes.get("/verify/:token", verifyUser);

export default userRoutes