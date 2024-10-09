import express from "express";
import {postCategory} from '../controllers/CategoryController.js'


let categoryRoutes = express.Router()

categoryRoutes.post('/', postCategory)

export default categoryRoutes
