import mongoose from "mongoose"

const FeedbackSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    }

})

const Feedback = mongoose.model("Feedbacks", FeedbackSchema)

export default Feedback