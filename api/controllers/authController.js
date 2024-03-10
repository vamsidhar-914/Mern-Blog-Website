const { createError } = require("../middleware/error")
const bcrypt = require('bcrypt')
const User = require("../models/User")
const jwt = require('jsonwebtoken')

// register api
const register = async(req, res,next) => {
    const { username , email ,password } = req.body
    if(!username || !email || !password || username === "" || email === '' || password === ''){
        return next(createError(400 , "All fields are required"))
    }

    const foundUser = await User.findOne({ username })
    const foundEmail = await User.findOne({ email })
    
    if(!foundUser || !foundEmail){
        return next(createError(400 , 'user already exists'))
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password , salt)

    const newUser = new User({
        username,
        email,
        password : hash
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
                isAdmin : validUser.isAdmin
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

const google = async(req,res,next) => {
    const { name  , email , googlePhotoUrl} = req.body
    try{
        const user = await User.findOne({ email })
        if(user){
            const token = jwt.sign({ id : user._id } , process.env.SECRET)
            const {password , ...rest } = user._doc
            res.status(200).cookie('access_token' , token , {
                httpOnly : true
            }).json(rest)
        } else{
            const generatePass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(generatePass , salt)
            const newUser = new User({
                username : name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password : hash,
                profilePicture : googlePhotoUrl
            })
            await newUser.save()
            const token = jwt.sign({ id : newUser._id} , process.env.SECRET)
            const { password , ...rest } = newUser._doc
            res.status(200).cookie("access_token" , token , {
                httpOnly : true,
            }).json(rest)
        }
    }catch(err){
        next(err)
    }
}


module.exports = { register,login,google} 