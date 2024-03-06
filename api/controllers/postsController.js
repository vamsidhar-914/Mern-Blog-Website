const { createError } = require("../middleware/error")
const Posts = require("../models/Posts")


const createPost = async (req,res,next) => {
    // if(!req.user.isAdmin){
    //     return next(createError(403 , 'you are not allowed'))
    // }
    
    if(!req.body.title || !req.body.content){
        return next(createError(400 , "fill all fields"))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'')
    const newPost = new Posts({
        ...req.body,slug,userId : req.user.id
    })
    try{
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    }catch(error){
        next(error)
    }
}

const getAllPosts = async(req,res,next) => {
    try{
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1
        const posts = await Posts.find({
            ...(req.query.userId && {userId : req.query.userId}),
            ...(req.query.category && {category : req.query.category}),
            ...(req.query.slug && {slug : req.query.slug}),
            ...(req.query.postId && {_id : req.query.postId}),
            ...(req.query.searchTerm && {
                $or : [
                    { title : { $regex : req.query.searchTerm , $options : 'i' } },
                    { content : { $regex : req.query.searchTerm , $options : 'i' } },
                ]
            })
            }) .sort({ updatedAt : sortDirection }).skip(startIndex).limit(limit)

        const totalPosts = await Posts.countDocuments();
        const now = new Date()
        const oneMonAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1,
            now.getDate()
        )
        const lastMonthPosts = await Posts.countDocuments({
            createdAt : { $gte : oneMonAgo },
        })

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts
        })
    }catch(err){
        next(err)
    }
}

const deletePosts = async(req,res,next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(createError(403 , "You are not allowed to that"))
    }
    try{
        await Posts.findByIdAndDelete(req.params.postId)
        res.status(200).json("The post has been deleted")
    }catch(err){
        next(err)
    }
}

const updatePost = async (req,res,next) => {
    if(!req.user.isAdmin || req.user.id !== req.params.userId){
        return next(createError(403 , 'You are not allowed to do that'))
    }
    try{
        const updatedPost= await Posts.findByIdAndUpdate(
            req.params.postId,
            {
                $set : {
                    title : req.body.title,
                    content : req.body.content,
                    category : req.body.category,
                    image : req.body.image
                }
            } , { new : true })
            res.status(200).json(updatedPost)
    }catch(err){
        next(err)
    }
}

module.exports =  { createPost , getAllPosts , deletePosts ,updatePost}