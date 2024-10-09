import expres from "express"

import {createGalleryItem, getGalleryItems} from '../controllers/GalleryItemController.js'

let galleryRoutes = expres.Router()


galleryRoutes.get('/', getGalleryItems)

galleryRoutes.post('/', createGalleryItem)


export default galleryRoutes