const express = require("express")
const { verifyUser, verifyToken } = require("../middleware/verifyJWT")
const { createPost, getAllPosts, deletePosts, updatePost } = require("../controllers/postsController")
const router = express.Router()

// create post
router.post("/newpost" ,verifyToken , createPost)
router.get("/allPosts" , getAllPosts)
router.delete("/deletePosts/:postId/:userId" , verifyToken , deletePosts)
router.put("/updatePost/:postId/:userId" ,  verifyToken , updatePost)

module.exports = router