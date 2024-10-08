import expres from "express"

import {createGalleryItem} from '../controllers/GalleryItemController.js'

let galleryRoutes = expres.Router()


galleryRoutes.post('/', createGalleryItem)


export default galleryRoutes