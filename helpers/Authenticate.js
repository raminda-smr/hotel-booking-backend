export function authenticateAdmin(req,res, message){

    const user = req.user

    if(user == null){
        res.status(403).json({
            'message': 'Please login to continue'
        })
        return
    }

    if(user.type != 'admin'){
        res.status(403).json({
            'message': message
        })
        return
    }
}