const Comment= require("../models/Comment")
const { createError } = require("../middleware/error")


const createComment = async(req,res,next) => {
    try{
        const { content , postId , userId } = req.body
        if(userId !== req.user.id){
            return next(createError(403 , 'You are not allowed to create this comment'))
        }
        const newComment = new Comment({
            content,
            postId,
            userId
        })
        await newComment.save()
        res.status(200).json(newComment)
    }catch(err){
        next(err)
    }
}

const getPostComments = async (req,res,next) => {
    try{
        const comments = await Comment.find({ postId : req.params.postId }).sort({
            createdAt : -1
        })
        res.status(200).json(comments)
    }catch(err){
        next(err)
    }
}

const likeComment = async(req,res,next) => {
    try{
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return next(createError(404 , 'Comment not found'))
        }
        const userIndex = comment.likes.indexOf(req.user.id)
        if(userIndex === -1){
            comment.numberOfLikes += 1
            comment.likes.push(req.user.id)
            
        }else{
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex , 1)
        }
        await comment.save()
        res.status(200).json(comment)
    }catch(err){
        next(err)
    }
}

const editComment = async (req,res,next) => {
    try{
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return next(404 , 'Comment Not Found')
        }
        if(comment.userId !== req.user.id && !req.user.isAdmin){
            return next(createError(403 , 'You are not allowed to edit this comment'))
        }
        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId , {
            content : req.body.content
        } , { new : true })
        res.status(200).json(editedComment)
    }catch(err){
        next(err)
    }
}

const deleteComment = async (req,res,next) => {
    try{
        const comment = await Comment.findById(req.params.commentId)
        if(!comment){
            return next(createError(404 , 'Comment not Found'))
        }
        if(comment.userId !== req.user.id || !req.user.isAdmin){
            return next(createError(403 , "You are not allowed to delete this comment"))
        }
        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json("comment has been deleted")
    }catch(err){
        next(err)
    }
}

module.exports = { 
    createComment,
    getPostComments,
    likeComment,
    editComment,
    deleteComment
 }