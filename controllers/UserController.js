import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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

    const newUser = new User(user)
    newUser.save().then(
        () => {
            res.json({
                "messge": "User created!"
            })
        }
    ).catch(
        () => {
            res.json({
                "messge": "User creation failed"
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

    User.findOne({ email:credentials.email, password: credentials.password}).then(
        (user)=>{
            if(user == null){
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

                const token = jwt.sign(preload, "secret", {expiresIn: "1h"})

                res.json({
                    message: "User found",
                    user: user,
                    token: token
                })
            }
        }
    )
}