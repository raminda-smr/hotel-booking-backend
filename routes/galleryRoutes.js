import expres from "express"

import {createGalleryItem, getGalleryItems, deleteGalleryItem} from '../controllers/GalleryItemController.js'

let galleryRoutes = expres.Router()


galleryRoutes.get('/', getGalleryItems)

galleryRoutes.post('/', createGalleryItem)

galleryRoutes.delete('/:id', deleteGalleryItem)


export default galleryRoutes