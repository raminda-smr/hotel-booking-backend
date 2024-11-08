import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

import {authenticateAdmin} from "../helpers/Authenticate.js"

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
    const hashPassword = bcrypt.hashSync(password, salt)

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

    authenticateAdmin(req, res, "You don't have permission to update")

    const email = req.params.email

    User.findOneAndUpdate({ email: email },
        {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'whatsapp': req.body.whatsapp,
            'phone': req.body.phone,
            'disabled': req.body.disabled,
            'img': req.body.img
        }
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


export function changePassword(req, res) {

    authenticateAdmin(req, res, "You don't have permission to change password")

    const email = req.params.email

    const credentials = req.body

    User.findOne({ email: email }).then(
        (user) => {

            if (user == null) {
                res.status(500).json({
                    message: "User not found",
                })
                return
            }
            else {

                const saltRounds = 10
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashNewPassword = bcrypt.hashSync(credentials.password, salt)

                User.findOneAndUpdate({ email: email },
                    {
                        'password': hashNewPassword,
                    }
                ).then(
                    () => {
                        res.json({
                            "messge": "Password changed!"
                        })
                    }
                ).catch(
                    () => {
                        res.json({
                            "messge": "Password update failed"
                        })
                    }
                )
            }
        }
    )
}


export function deleteUser(req, res) {

    authenticateAdmin(req, res, "You don't have permission to delete user")

    const email = req.params.email

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



export function loginUser(req, res) {
    const credentials = req.body

    User.findOne({ email: credentials.email }).then(
        (user) => {

            if (user == null) {
                res.status(500).json({
                    message: "User not found",
                })
                return
            }

            const password = credentials.password
            const passwordMatched = bcrypt.compare(password, user.password)

            if (!passwordMatched) {
                res.status(403).json({
                    message: "User not found"
                })
            }
            else {
                const preload = {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    type: user.type
                }

                const token = jwt.sign(preload, process.env.JWT_KEY, { expiresIn: "48h" })

                res.json({
                    message: "User found",
                    user: user,
                    token: token
                })
            }
        }
    )
}

export function getUser(req, res) {
    const user = req.user

    if (user == null) {
        res.json({
            message: "Not found"
        })
    }
    else {
        res.json({
            message: "Found",
            user: user
        })
    }
}


export function checkEmailExist(req, res) {

    const email = req.params.email

    User.findOne({ email: email }).then(
        (user) => {
            if (user) {
                res.status(500).json({
                    message: "User already exist"
                })
            }
            else {
                res.json({
                    message: "No user found"
                })
            }
        }
    ).catch(
        (err) => {
            if (err) {
                res.json({
                    message: "No user found"
                })
            }
        }
    )
}