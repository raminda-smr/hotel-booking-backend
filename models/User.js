import mongoose from "mongoose"

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        img: {
            type: String,
            default: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
        },
        password: {
            type: String,
            required: true
        }

    }
)

const User = mongoose.model("Users", userSchema)

export default User