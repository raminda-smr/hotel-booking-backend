import express from "express";
import {getCategoryList, postCategory, deleteCategory, getCategoryByName, getCategoryByPrice, updateCategory} from '../controllers/CategoryController.js'


let categoryRoutes = express.Router()

categoryRoutes.get('/', getCategoryList)

categoryRoutes.post('/', postCategory)

categoryRoutes.put('/:name', updateCategory)

categoryRoutes.delete('/:name', deleteCategory)

categoryRoutes.get('/name/:name', getCategoryByName)

categoryRoutes.get('/price/:price', getCategoryByPrice)

export default categoryRoutes
