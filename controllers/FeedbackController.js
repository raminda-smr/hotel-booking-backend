import { authenticateAdmin, authenticateCustomer } from "../helpers/Authenticate.js";
import Feedback from "../models/Feedback.js";
import User from './../models/User.js';
import config from '../config/config.js'
import { generatePagination } from "../helpers/Paginate.js";

export function createFeedback(req, res) {

    const authenticated = authenticateCustomer(req, res, "You must login as a customer to create a feedback!")
    if (!authenticated) {
        return // stop processing
    }

    const loggedUser = req.user
    const feedback = req.body

    const feedbackData = {
        email: loggedUser.email,
        username: loggedUser.firstName + " " + loggedUser.lastName,
        title: feedback.title,
        rating: feedback.rating,
        description: feedback.description,
    }


    const newFeedback = new Feedback(feedbackData)

    newFeedback.save().then(
        (result) => {
            if (result) {
                res.json({
                    message: "Feedback created",
                    result: result
                })
            }
            else {
                res.status(500).json({
                    message: "Feedback creation failed",
                })
            }
        }
    ).catch(
        (err) => {
            if (err != undefined) {
                res.status(500).json({
                    message: "Feedback creation failed",
                    error: err
                })
            }
        }
    )


}


export function getFeedbacks(req, res) {

    const authenticated =  authenticateAdmin(req, res, "You must login as a admin to update a feedback!")
    if(!authenticated){
        return // stop processing
    }

    const perPage = config.pagination.perPage || 10; // Default items per page
    const pageGap = config.pagination.pageGap || 2; // Default page gap
    const currentPage = parseInt(req.query.page) || 1; // Current page from query param

    Feedback.countDocuments()
        .then(totalItems => {
            const pagination = generatePagination(currentPage, totalItems, perPage, pageGap);

            return Feedback.find()
                .sort({ date: -1 })
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .then(list => {
                    res.json({
                        list,
                        pagination
                    });
                });
        })
        .catch(err => {
            res.status(500).json({ error: "Failed to fetch feedbacks", details: err.message });
        });

}

export function getPublicFeedbacks(req, res) {


    const limit = req.query && req.query.limit ? req.query.limit : 10

    Feedback.find({ approved: true })
        .limit(limit)
        .then(async (feedbacks) => {
            // For each feedback, fetch the corresponding user data
            const feedbacksWithUserImage = await Promise.all(
                feedbacks.map(async (feedback) => {
                    const user = await User.findOne({ email: feedback.email }).select('img');
                    return {
                        ...feedback.toObject(), // Convert Mongoose document to plain object
                        userImage: user ? user.img : null // Add userImage field
                    }
                })
            );

            res.json({
                list: feedbacksWithUserImage
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: err.message
            })
        })

}

export function getFeedbackById(req, res) {

    const authenticated = authenticateAdmin(req, res, "You must login as a admin to view a feedback!")
    if (!authenticated) {
        return // stop processing
    }

    const feedbackId = req.params.feedback

    Feedback.findOne({ _id: feedbackId }).then(
        (feedback) => {

            if (feedback) {
                res.json({
                    message: "Feedback found",
                    feedback: feedback,
                })
            }

        }
    ).catch(
        (err) => {
            if (err) {
                res.status(500).json({
                    message: "Feedback not found",
                    error: err
                })
            }
        }
    )
}

export function getCustomerFeedbackById(req, res) {

    const authenticated = authenticateCustomer(req, res, "You must login as a customer to view a feedback!")
    if (!authenticated) {
        return // stop processing
    }

    const feedbackId = req.params.feedback
    const loggedUser = req.user

    Feedback.findOne({ _id: feedbackId, email: loggedUser.email }).then(
        (feedback) => {

            if (feedback) {
                res.json({
                    message: "Feedback found",
                    feedback: feedback,
                })
            }

        }
    ).catch(
        (err) => {
            if (err) {
                res.status(500).json({
                    message: "Feedback not found",
                    error: err
                })
            }
        }
    )
}

export function updateFeedback(req, res) {

    const authenticated =  authenticateAdmin(req, res, "You must login as a admin to update a feedback!")
    if(!authenticated){
        return // stop processing
    }
    
    const feedbackId = req.params.feedback

    let feedback = req.body

    // console.log(feedback)
    Feedback.findOneAndUpdate({ _id: feedbackId }, feedback).then(
        (result) => {
            if (result) {
                res.json({
                    message: "Feedback updated ",
                })
            }

            console.log(result)
        }
    ).catch(
        (err) => {
            if (err) {
                res.status(500).json({
                    message: "Feedback update failed",
                    error: err
                })
            }
        }
    )




}

export function deleteFeedback(req, res) {

    const authenticated = authenticateAdmin(req, res, "You must login as a admin to delete a feedback!")
    if(!authenticated){
        return // stop processing
    }

    const feedbackId = req.params.feedback

    Feedback.findOneAndDelete({ _id: feedbackId }).then(
        () => {
            res.json({
                "message": "Feedback deleted"
            })
        }
    ).catch(
        (err) => {
            if (err != undefined) {
                res.json({
                    "message": "Feedback deletation failed"
                })
            }
        }
    )
}


export function getCustomerFeedbacks(req,res){
    const authenticated = authenticateCustomer(req, res, "You must login as a customer to get this data")
    if(!authenticated){
        return
    }

    const loggedUser = req.user

    // Define the query condition
    let queryCondition = { email: loggedUser.email };

    Feedback.find(queryCondition)
    .sort({ date: -1 })
    .then(
        (result)=>{
            if(result){
                // console.log(result)
                res.json({
                    message:"Feedbacks found",
                    list: result || [] 
                })
            }
        }
    ).catch(
        (err) =>{
            if(err){
                res.status(500).json({
                    message:err.message
                })
            }
           
        }
    )
}