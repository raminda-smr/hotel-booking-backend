import express from 'express'
import bodyParser from 'body-parser'

// Create a application instance
let app = express()

const JSONParser = bodyParser.json()
app.use(bodyParser)



// First request and response
app.get('/', (req, res) => {
    console.log("GET request")
    res.json({
      message: "Hi Raminda"  
    })
})


app.post('/', (req, res) => {
    const name = req.body.name
    const message = "Hi, " + name
    console.log("Post request")
    res.json({
      message: message
    })
})

// Run applicaion in given port
app.listen(3000, (req,res)=>{
    console.log("Server is running on port 3000")
})