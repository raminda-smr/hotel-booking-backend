import User from '../models/User.js'

export function postUsers(req, res) {

    const user = req.body
    const newUser = new User(user)
    newUser.save().then(
        ()=>{
            res.json({
                "messge": "User created!"
            })
        }
    ).catch(
        ()=>{
            res.json({
                "messge": "User creation failed"
            })
        }
    )

}