import mongoose from "mongoose"

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },

        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String
        },
        type:{
            type: String,
            required: true,
            default: 'customer'
        },
        whatsapp:{
            type:String
        },
        phone:{
            type: String
        },
        disabled: {
            type: Boolean,
            required: true,
            default:false
        },
        emailVerified: {
            type:Boolean,
            required:true,
            default:false
        },
        img:{
            type: String
        }

    }
)

const User = mongoose.model("Users", userSchema)

export default User