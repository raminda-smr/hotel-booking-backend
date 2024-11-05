import expres from "express"

import {createGalleryItem, getGalleryItems, updateGalleryItem,  deleteGalleryItem} from '../controllers/GalleryItemController.js'

let galleryRoutes = expres.Router()


galleryRoutes.get('/', getGalleryItems)

galleryRoutes.post('/', createGalleryItem)

galleryRoutes.put('/:id', updateGalleryItem)

galleryRoutes.delete('/:id', deleteGalleryItem)


export default galleryRoutes