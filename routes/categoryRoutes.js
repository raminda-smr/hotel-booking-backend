import express from "express";
import {getCategoryList, postCategory} from '../controllers/CategoryController.js'


let categoryRoutes = express.Router()

categoryRoutes.get('/', getCategoryList)

categoryRoutes.post('/', postCategory)

export default categoryRoutes
