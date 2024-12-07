import { authenticateAdmin, authenticateCustomer } from "../helpers/Authenticate.js";
import Feedback from "../models/Feedback.js";
import User from './../models/User.js';

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

    const limit = req.query && req.query.limit ? req.query.limit : 10

    Feedback.find()
        .limit(limit)
        .then(
        (list) => {
            res.json({
                list: list
            })
        }
    )

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

    Feedback.find(queryCondition).then(
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