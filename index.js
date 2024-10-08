import express from 'express'
import bodyParser from 'body-parser'
import userRoutes from './routes/userRoutes.js'

// Create a application instance
let app = express()

const JSONParser = bodyParser.json()
app.use(JSONParser)



app.use('/users', userRoutes)

// Run applicaion in given port
app.listen(3000, (req,res)=>{
    console.log("Server is running on port 3000")
})