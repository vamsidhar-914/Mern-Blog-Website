const express= require("express")
const router = express.Router()
const { register, login, google } = require("../controllers/authController")

// register route
router.post("/register" , register)

//login route
router.post("/login" , login)
router.post("/google" , google)

module.exports = router;