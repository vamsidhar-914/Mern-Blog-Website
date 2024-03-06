const jwt = require('jsonwebtoken')
const { createError } = require('./error')

const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token
    if(!token){
        return next(createError(401 , 'unAuthorized'))
    }
    jwt.verify(token , process.env.SECRET, (err,user) => {
        if(err){
            return next(createError(401,'unAuthorized'))
        }
        req.user = user
        next()
    })
}

const verifyUser = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        } else{
            return next(createError(403,"you are not the authorized"))
        }
    })
}

const verifyAdmin = (req,res,next) => {
    verifyJWT(req,res, () => {
        if(req.user.isAdmin){
            next()
        }else{
            return next(createError(403 , "You are not authorized"))
        }
    })
}

module.exports = { verifyToken , verifyUser}