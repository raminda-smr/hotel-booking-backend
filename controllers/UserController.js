import User from '../models/User.js'

export function getUsers(req, res) {
  User.find().then(
      (usersList)=>{
          res.json({
              'list': usersList
          })
      }
  )
}

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


export function putUser(req, res){
    const email = req.body.email

    User.findOneAndUpdate({email:email},
            {'firstName': req.body.firstName, 'lastName': req.body.lastName }
    ).then(
        ()=>{
            res.json({
                "messge": "User updated!"
            })
        }
    ).catch(
        ()=>{
            res.json({
                "messge": "User update failed"
            })
        }
    )
   
}