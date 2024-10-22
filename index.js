import express from 'express'
import bodyParser from 'body-parser'
import userRoutes from './routes/userRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bookingRoutes from './routes/bookingRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'

dotenv.config()


// Create a application instance
let app = express()

const JSONParser = bodyParser.json()
app.use(JSONParser)

// Authorization middleware
app.use((req,res,next) =>{

    const tokenAuthorization = req.headers.authorization
    
    // Check if authorization available
    if(tokenAuthorization){

        const token = tokenAuthorization.replace("Bearer ","")

        if(token != null){
            jwt.verify(token, process.env.JWT_KEY ,(err,decoded)=>{
                if(decoded != null){
                    req.user = decoded
                    // console.log(decoded)
                    // next()
                }
                else{
                    // console.log(err)
                    // next()
                }
            })
        }
        
    }
   
    // Forward request
    next()


})

// Database Connection String
const connectionString = process.env.MONGO_URL

mongoose.connect(connectionString).then(
    ()=>{
        console.log('Connnected to the database!')
    }
).catch(
    ()=> {
        console.log('Connection to the database is failed!')
    }
)


app.use('/api/users', userRoutes)

app.use('/api/gallery', galleryRoutes)

app.use('/api/categories', categoryRoutes)

app.use('/api/rooms', roomRoutes)

app.use('/api/bookings', bookingRoutes)

app.use('/api/feedbacks', feedbackRoutes)

// Run applicaion in given port
app.listen(3000, (req,res)=>{
    console.log("Server is running on port 3000")
})