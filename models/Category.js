import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
})

const Category = mongoose.model('Categories', CategorySchema)

export default Category