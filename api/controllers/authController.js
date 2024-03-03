const { createError } = require("../middleware/error")
const bcrypt = require('bcrypt')
const User = require("../models/User")
const jwt = require('jsonwebtoken')

// register api
const register = async(req, res,next) => {
    const { username , email ,password } = req.body
    if(!username || !email || !password || username === "" || email === '' || password === ''){
        return res.status(400).json({message : "all fields are required"})
    }
    const hashedPassword = await bcrypt.hash(password , 10)

    const newUser = new User({
        username,
        email,
        password : hashedPassword
    })
    try{
        await newUser.save()
        res.status(200).json("reigstered succesfully")
    }catch(error){
        next(error)
    }
}

//loginapi
const login = async(req,res,next) => {
    const { email , password } = req.body
    if(!email || !password || email ==='' || password === ""){
        // res.status(400).json({ message : "All fields are required"})
        return next(createError(400 , "All fields are required"))
    }
    try{
        const validUser = await User.findOne({ email })
        if(!validUser){
            return next(createError(404,"User not found"))
        }
        const match = await  bcrypt.compare(password , validUser.password)
        if(!match){
            return next(createError(400 ,'invalid password'))
        }
        const token = jwt.sign(
            {
                id : validUser._id,
            }, process.env.SECRET
        )
        const { password : pass , ...others } = validUser._doc
        res.status(200).cookie('access_token',token,{
            httpOnly : true
        }).json(others)
    }catch(err){
        next(err)
    }
} 


module.exports = { register,login } 