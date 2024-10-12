import express from "express";
import {getCategoryList, postCategory, deleteCategory} from '../controllers/CategoryController.js'


let categoryRoutes = express.Router()

categoryRoutes.get('/', getCategoryList)

categoryRoutes.post('/', postCategory)

categoryRoutes.delete('/:name', deleteCategory)



export default categoryRoutes
