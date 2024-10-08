import express from "express"
import { getUser } from "../controllers/UserController.js"

let userRoutes = express.Router()

userRoutes.get('/', getUser)


export default userRoutes