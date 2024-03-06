const express = require("express");
const { updateUser, deleteUser, logoutUser, getUsers } = require("../controllers/userController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router()

router.put("/update/:id" , verifyToken ,updateUser)
router.delete("/delete/:id" , verifyToken ,deleteUser)
router.post("/logout" , logoutUser)
router.get("/getallUsers" , verifyToken , getUsers)

module.exports = router;