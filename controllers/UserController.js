import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()


export function getUsers(req, res) {
    User.find().then(
        (usersList) => {
            res.json({
                'list': usersList
            })
        }
    )
}

export function postUsers(req, res) {

    const user = req.body

    const password = user.password

    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password,salt)

    user.password = hashPassword

    const newUser = new User(user)
    newUser.save().then(
        () => {
            res.json({
                "message": "User created!"
            })
        }
    ).catch(
        () => {
            res.json({
                "message": "User creation failed"
            })
        }
    )

}


export function putUser(req, res) {
    const email = req.body.email

    User.findOneAndUpdate({ email: email },
        { 'firstName': req.body.firstName, 'lastName': req.body.lastName }
    ).then(
        () => {
            res.json({
                "messge": "User updated!"
            })
        }
    ).catch(
        () => {
            res.json({
                "messge": "User update failed"
            })
        }
    )

}


export function deleteUser(req, res) {

    const email = req.body.email

    User.findOneAndDelete({ email: email }).then(
        () => {
            res.json({
                "messge": "User deleted!"
            })
        }
    ).catch(
        () => {
            res.json({
                "messge": "User delete failed"
            })
        }
    )

}



export function loginUser(req,res){
    const credentials = req.body

    User.findOne({ email:credentials.email}).then(
        (user)=>{

            const password =  credentials.password
            const passwordMatched = bcrypt.compare(password, user.password)

            if(!passwordMatched){
                res.status(403).json({
                    message: "User not found"
                })
            }
            else{
                const preload = {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    type: user.type
                }

                const token = jwt.sign(preload, process.env.JWT_KEY , {expiresIn: "48h"})

                res.json({
                    message: "User found",
                    user: user,
                    token: token
                })
            }
        }
    )
}

export function getUser(req, res){
    const user = req.body.user
    
    if(user == null){
        res.json({
            message: "Not found"
        })
    }
    else{
        res.json({
            message: "Found",
            user: user
        })
    }
}