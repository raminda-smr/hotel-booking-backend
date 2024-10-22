import { authenticateCustomer } from "../helpers/Authenticate.js";
import Feedback from "../models/Feedback.js";

export function  createFeedback(req,res){

    authenticateCustomer(req,res, "You must login as a customer to create a feedback!")

    const feedback = req.body

    const newFeedback = new Feedback(feedback)

    newFeedback.save().then(
        (result) => {
            if(result){
                res.json({
                    message:"Feedback created",
                    result: result
                })
            }
            else{
                res.status(500).json({
                    message:"Feedback creation failed",
                })
            }
        }
    ).catch(
        (err) => {
            if(err != undefined){
                res.status(500).json({
                    message:"Feedback creation failed",
                    error: err
                })
            }
        }
    )


}


export function  getFeedbacks(req,res){

    Feedback.find().then(
        (list){
            res.json({
                list: list
            })
        }
    )

}

export function  updateFeedback(req,res){
    
    

}

export function  deleteFeedback(req,res){
    
}
