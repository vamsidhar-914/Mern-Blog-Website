const { createError } = require("../middleware/error")
const User = require("../models/User")
const bcrypt = require('bcrypt')

const updateUser = async (req,res) => {
    if(req.user.id !== req.params.id){
        return next(createError(403,"you are not allowed to do that"))
    }
    // if(req.body.password.length < 6){
    //     return next(createError(400 , 'password must be atleast 6 characters'))
    // }
    // req.body.password = bcrypt.hash(req.body.password, 10)
    // if(req.body.username){
    //     if(req.body.username.length < 7 || req.body.username.length > 20){
    //         return next(createError(400 , 'username must be between 7 and 20 characters'))
    //     }
    // }
    // if(req.body.username.includes(' ')){
    //     return next(createError(400,'username should not include spaces'))
    // }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id , {
            $set : req.body
            // $set : {
            //     // username : req.body.username,
            //     // email : req.body.email,
            //     // profilePicture : req.body.profilePicture,
            //     // password : req.body.password
            // }
        } , { new : true })
        const { password , ...rest } = updatedUser._doc
        res.status(200).json(rest)
    }catch(error){
        next(error)
    }
}

const deleteUser = async(req,res,next) => {
    if(req.user.id !== req.params.id){
        return next(createError(403,'You are not allowed to delete this user'))
    }
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('user has been deleted')
    }catch(error){
        next(error)
    }
}

const logoutUser = (req,res,next) => {
    try{
        res.clearCookie('access_token').status(200).json('User has been logged out')
    }catch(error){
        next(error)
    }
}

module.exports = { updateUser , deleteUser , logoutUser }