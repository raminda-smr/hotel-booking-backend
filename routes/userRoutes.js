import express from "express"

let userRoutes = express.Router()

userRoutes.get('/', (req, res) => {
    res.json({
      message: "User Route list"  
    })
})


export default userRoutes