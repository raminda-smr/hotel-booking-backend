import express from 'express'
import { createFeedback, deleteFeedback, getFeedbacks, updateFeedback, getFeedbackById } from '../controllers/FeedbackController.js'


let feedbackRoutes = express.Router()

feedbackRoutes.get("/", getFeedbacks)

feedbackRoutes.post("/", createFeedback)

feedbackRoutes.get("/:feedback", getFeedbackById)

feedbackRoutes.put("/:feedback", updateFeedback)

feedbackRoutes.delete("/:feedback", deleteFeedback)


export default feedbackRoutes