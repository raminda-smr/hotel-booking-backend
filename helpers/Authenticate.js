export function authenticateAdmin(req,res, message){

    authenticateUser(message, 'admin')
}


export function authenticateCustomer(req,res, message){

    authenticateUser(message, 'customer')
}


function authenticateUser(message, userType){
    
    const user = req.user

    if(user == null){
        res.status(403).json({
            'message': 'Please login to continue'
        })
        return
    }

    if(user.type != userType ){
        res.status(403).json({
            'message': message
        })
        return
    }
}
