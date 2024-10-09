import express from 'express'
import bodyParser from 'body-parser'
import userRoutes from './routes/userRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import mongoose from 'mongoose'


// Create a application instance
let app = express()

const JSONParser = bodyParser.json()
app.use(JSONParser)

// Authorization middleware
app.use((req,res,next) =>{

    const authorization = req.headers.authorization
    
    if(authorization){
        const token = req.headers("Authorization")?.repalce("Bearer","")

        if(token != null){
            jwt.verify(token, 'secret',(err,decoded)=>{
                if(decoded != null){
                    req.user = decoded
                    cosole.log(decoded)
                    next()
                }
                else{
                    next()
                }
            })
        }
    }
   
    // Forward non-authorized tokens to the endpoints
    next()


})

// Database Connection String
const connectionString = "mongodb+srv://tester:123@cluster0.kvg7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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

// Run applicaion in given port
app.listen(3000, (req,res)=>{
    console.log("Server is running on port 3000")
})