import Booking from "../models/Booking.js"
import {authenticateCustomer} from '../helpers/Authenticate.js'

export function createBooking(req,res){

    authenticateCustomer(req,res, "You must login as a customer to create a booking!")

    let startingId = 1201

    Booking.countDocuments({}).then(
        (count) =>{
            if(count != null){
                // Get next booking id
                let newCount = count + startingId;

                const newBooking = new Booking({
                    bookingId: newCount,
                    roomId: req.body.roomId,
                    email: req.user.email,
                    phone: req.body.phone,
                    start: req.body.start,
                    end: req.body.end
                })

                newBooking.save().then(
                    (result) => {
                        res.json({
                            message: "Booking created successfully",
                            result: result
                        })
                    }
                ).catch(
                    (err) => {
                        res.json({
                            message: "Booking creation failed",
                            error: err
                        })
                    }
                )
                
            }
        }
    )

    return startingId
    
}

export function getBookings(req, res){

    Booking.find().then(
        (list)=>{
            res.json({
                list:list
            })
        }
    )
       
}