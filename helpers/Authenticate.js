export function authenticateAdmin(req,res, message){

    authenticateUser(req, res, message, 'admin')
}


export function authenticateCustomer(req,res, message){

    authenticateUser(req, res, message, 'customer')
}


function authenticateUser(req, res, message, userType){
    
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
