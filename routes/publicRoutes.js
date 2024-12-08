import express from "express"
import { sendContactMail } from "../controllers/PublicController.js"

let publicRoutes = express.Router()

publicRoutes.post('/send-contact', sendContactMail)

export default publicRoutes