import express from 'express'

// Create a application instance
let app = express()

// First request and response
app.get('/', (req, res) => {
    console.log("GET request")
    res.json({
      message: "Hi Raminda"  
    })
})


// Run applicaion in given port
app.listen(3000, (req,res)=>{
    console.log("Server is running on port 3000")
})