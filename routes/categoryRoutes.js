import express from "express";
import {getCategoryList, postCategory, deleteCategory} from '../controllers/CategoryController.js'


let categoryRoutes = express.Router()

categoryRoutes.get('/', getCategoryList)

categoryRoutes.delete('/:name', deleteCategory)

categoryRoutes.post('/', postCategory)

export default categoryRoutes
