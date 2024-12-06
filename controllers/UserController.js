import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import nodemailer from "nodemailer";

import { authenticateAdmin } from "../helpers/Authenticate.js"

dotenv.config()


export function getUsers(req, res) {

    
    const authenticated = authenticateAdmin(req, res, "You don't have permission to get user list")
    if (!authenticated) {
        return // stop processing
    }

    
    User.find().then(
        (usersList) => {
            res.json({
                'list': usersList
            })
        }
    )
}

export function postUsers(req, res) {

    const authenticated = authenticateAdmin(req, res, "You don't have permission to create user")
    if (!authenticated) {
        return // stop processing
    }

    const user = req.body

    user.password = encryptPassword(user.password)

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

export function registerUser(req, res) {

    const user = req.body

    // Validate email format
    if (!isValidEmail(user.email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email already exists
    User.findOne({ email: user.email }).then(
        (existingUser) => {
            if (existingUser) {
                return Promise.reject({ status: 400, message: "Email already registered" });
            }

            user.password = encryptPassword(user.password)

            // limit user type
            user.type = 'customer'
            user.emailVerified = false

            const newUser = new User(user)
            newUser.save().then(
                (savedUser) => {
                    // Generate a verification token
                    const token = jwt.sign(
                        { userId: savedUser._id }, // Payload contains user ID
                        process.env.JWT_KEY,   // Secret key
                        { expiresIn: "1h" }       // Token expires in 1 hour
                    );

                    const verificationLink = `${process.env.CLIENT_APP_URL}/verify/${token}`;
                    return sendVerificationEmail(savedUser.email, verificationLink);

                }
            )
                .then(() => {
                    return res.status(201).json({ message: "User created! Please verify your email." });
                })
                .catch(
                    (error) => {
                        if (error.status) {
                            res.status(error.status).json({ message: error.message });
                        } else {
                            console.error(error);
                            res.status(500).json({ message: "User creation failed", error });
                        }
                    }
                )
        }
    ).catch(
        (error) => {
            res.status(500).json({ message: "User creation failed", error });
        }
    )

}

export function putUser(req, res) {

    const authenticated = authenticateAdmin(req, res, "You don't have permission to update user")
    if (!authenticated) {
        return // stop processing
    }

    const email = req.params.email

    const protectedEmails = ['admin@email.com', 'customer@email.com'];
    
    if (protectedEmails.includes(email)) {
        return res.status(403).json({
            message: "This account is protected and cannot be updated."
        });
    }

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

    const authenticated = authenticateAdmin(req, res, "You don't have permission to change password")
    if (!authenticated) {
        return // stop processing
    }

    const email = req.params.email

    const protectedEmails = ['admin@email.com', 'customer@email.com'];
    
    if (protectedEmails.includes(email)) {
        return res.status(403).json({
            message: "This account is protected and cannot be password changed."
        });
    }

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

                const hashNewPassword = encryptPassword(credentials.password)

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

    const authenticated = authenticateAdmin(req, res, "You don't have permission to delete user")
    if (!authenticated) {
        return // stop processing
    }

    const email = req.params.email

    const protectedEmails = ['admin@email.com', 'customer@email.com'];

    if (protectedEmails.includes(email)) {
        return res.status(403).json({
            message: "This account is protected and cannot be deleted."
        });
    }


    User.findOneAndDelete({ email: email }).then(
        () => {
            res.json({
                "message": "User deleted!"
            })
        }
    ).catch(
        () => {
            res.status(500).json({
                message: "User delete failed"
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

            if (user.disabled) {
                res.status(403).json({
                    message: "User not found"
                })
                return
            }

            if (user.emailVerified == false) {
                res.status(402).json({
                    message: "User not verified",
                })
                return
            }



            const password = credentials.password
            const passwordMatched = bcrypt.compare(password, user.password)

            if (!passwordMatched) {
                res.status(403).json({
                    message: "Password missmatched!"
                })
            }
            else {
                const preload = {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    type: user.type,
                    image: user.img
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

    const authenticated = authenticateAnyUser(req, res)
    if (!authenticated) {
        return // stop processing
    }

    const user = req.user

    if (user == null) {
        res.status(500).json({
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

export function verifyUser(req, res) {
    const { token } = req.params;

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Extract the user ID from the decoded token
        const userId = decoded.userId;

        // Find the user by ID and update verification status
        User.findById(userId)
            .then(user => {
                if (!user) {
                    return Promise.reject({ status: 404, message: "User not found" });
                }

                if (user.emailVerified) {
                    return Promise.reject({ status: 400, message: "User already verified" });
                }

                user.emailVerified = true;
                return user.save();
            })
            .then(() => {
                res.status(200).json({ message: "Email successfully verified!" });
            })
            .catch(error => {
                if (error.status) {
                    res.status(error.status).json({ message: error.message });
                } else {
                    console.error(error);
                    res.status(500).json({ message: "Verification failed", error });
                }
            });
    });
}

export function requestVerification(req, res) {

    const user = req.body

    console.log(user);

    // Validate email format
    if (!isValidEmail(user.email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email already exists
    User.findOne({ email: user.email }).then(
        (existingUser) => {
            if (existingUser && existingUser.emailVerified == false) {

                const token = jwt.sign(
                    { userId: existingUser._id }, // Payload contains user ID
                    process.env.JWT_KEY,   // Secret key
                    { expiresIn: "1h" }       // Token expires in 1 hour
                );

                const verificationLink = `${process.env.CLIENT_APP_URL}/verify/${token}`;

                sendVerificationEmail(existingUser.email, verificationLink).then(
                    (result) => {
                        return res.json({ message: "Email sent successfully." })
                    }
                ).catch(
                    (error) => {
                        return res.status(error.status).json({ message: "Email sending failed.", error: error.message })
                    }
                )
            }
            else {
                return res.status(500).json({ message: "User verified" });
            }
        }
    ).catch(
        (error) => {
            if (error) {
                res.status(500).json({ message: "User not found" });
            }
        }
    )
}

export function requestPasswordResetLink(req, res) {

    const { email } = req.body



    User.findOne({ email: email, emailVerified: true, disabled: false }).then(
        (user) => {

            if (!user) {
                return res.status(500).json({ message: "User not found" });
            }

            // Generate a JWT token
            const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: process.env.RESET_TOKEN_EXPIRY });

            const resetLink = process.env.CLIENT_APP_URL + `/set-new-password/${token}`;

            sendPasswordResetEmail(email, resetLink).then(
                (result) => {
                    return res.json({ message: "Email sent successfully." })
                }
            ).catch(
                (error) => {
                    return res.status(error.status).json({ message: "Email sending failed.", error: error.message })
                }
            )

        }
    ).catch(
        (error) => {
            if (error) {
                res.status(500).json({ message: "User not found" });
            }
        }
    )

}


export function resetPassword(req, res) {
    const { token, password } = req.body

    if (token.length > 0 && password.length > 6) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        User.findOne({ email: decoded.email, emailVerified: true })
            .then(
                (user) => {
                    if (user) {
                        if (user.disabled == true) {
                            res.status(500).json({ message: 'User disabled. Please contact an admin.' })
                        }
                        else {

                            const hashNewPassword = encryptPassword(password)

                            User.findOneAndUpdate({ email: decoded.email },
                                {'password': hashNewPassword}
                            ).then(
                                () => {

                                    const loginLink = process.env.CLIENT_APP_URL + `/login`;
                                    sendPasswordChangedNotification(decoded.email, loginLink)

                                    res.json({
                                        "messge": "Password changed!"
                                    })
                                }
                            ).catch(
                                () => {
                                    res.status(500).json({
                                        "messge": "Password update failed"
                                    })
                                }
                            )
                        }

                    }
                    else {
                        res.status(500).json({ message: 'User not found' })
                    }
                }
            )
            .catch(
                (err) => {
                    if (err) {
                        res.status(500).json({ message: err.message })
                    }
                }
            )
    }
    else {
        res.status(500).json({ message: "Password must contain 6 characters" })
    }
}


export function getUserProfile(req, res){
    
    const authenticated = authenticateAnyUser(req, res)
    if (!authenticated) {
        return // stop processing
    }

    const loggedUser = req.user

    User.find({ email: loggedUser.email }).then(
        (user) => {
            if(user != null){
                user.password = ""

                res.json({
                    message: "Profile Found",
                    user: user
                })
            }
        }
    ).catch(
        (err)=>{
            if(err){
                res.status(500).json({
                    message: "Not found",
                    err: err.message
                })
            }
        }
    )

}



/* ----------------------------------------- */
/* ---------- SUPPORT FUNCTIONS ------------ */
/* ----------------------------------------- */

function encryptPassword(password) {
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt)
}

function isValidEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
}

function sendVerificationEmail(email, verificationLink) {

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Click the link below to verify your email:</p>
               <a href="${verificationLink}">${verificationLink}</a>`,
    };

    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log("Verification email sent:", info.response);
        })
        .catch(err => {
            console.error("Error sending email:", err);
            throw new Error("Failed to send verification email");
        });
}

function sendPasswordResetEmail(email, verificationLink) {

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Your password",
        html: `<p>Click the link below to reset your password:</p>
               <a href="${verificationLink}">${verificationLink}</a>`,
    };

    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log("Verification email sent:", info.response);
        })
        .catch(err => {
            console.error("Error sending email:", err);
            throw new Error("Failed to send verification email");
        });
}

function sendPasswordChangedNotification(email, loginLink) {

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your password changed",
        html: `<p>Click the link below to login with your new password:</p>
            <a href="${loginLink}">${loginLink}</a>`,
    };

    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log("Verification email sent:", info.response);
        })
        .catch(err => {
            console.error("Error sending email:", err);
            throw new Error("Failed to send verification email");
        });
}


