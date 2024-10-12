import express from "express";
import {getCategoryList, postCategory, deleteCategory, getCategoryByName} from '../controllers/CategoryController.js'


let categoryRoutes = express.Router()

categoryRoutes.get('/', getCategoryList)

categoryRoutes.post('/', postCategory)

categoryRoutes.delete('/:name', deleteCategory)

categoryRoutes.get('/:name', getCategoryByName)

export default categoryRoutes
