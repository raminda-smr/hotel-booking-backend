import express from 'express'
import { createFeedback, deleteFeedback, getFeedbacks, updateFeedback, getFeedbackById, getCustomerFeedbacks } from '../controllers/FeedbackController.js'


let feedbackRoutes = express.Router()

feedbackRoutes.get("/", getFeedbacks)

feedbackRoutes.post("/", createFeedback)

feedbackRoutes.get("/customer", getCustomerFeedbacks)

feedbackRoutes.get("/customer/:feedback", getFeedbackById)

feedbackRoutes.get("/:feedback", getFeedbackById)

feedbackRoutes.put("/:feedback", updateFeedback)

feedbackRoutes.delete("/:feedback", deleteFeedback)


export default feedbackRoutes