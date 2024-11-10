export function authenticateAdmin(req,res, message){

    return authenticateUser(req, res, message, 'admin')
}


export function authenticateCustomer(req,res, message){

    return authenticateUser(req, res, message, 'customer')
}

export function authenticateAnyUser(req,res, message){

    const user = req.user
    let userAuthenticated = true;

    if(!checkIfUserExist(user, res)){
        userAuthenticated = false
    }

    return userAuthenticated
}


function authenticateUser(req, res, message, userType){
    
    const user = req.user
    let userAuthenticated = true;

    if(!checkIfUserExist(user, res)){
        userAuthenticated = false
    }
    else if(user.type != userType ){
        res.status(403).json({
            'message': message
        })
        userAuthenticated = false
    }

    return userAuthenticated
}


function checkIfUserExist(user, res){
    let userExist = true 
    if(user == null){
        res.status(403).json({
            'message': 'Please login to continue'
        })
        userExist = false
    }

    return userExist
}