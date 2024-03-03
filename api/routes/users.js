const express = require("express");
const { updateUser, deleteUser, logoutUser } = require("../controllers/userController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router()

router.put("/update/:id" , verifyToken ,updateUser)
router.delete("/delete/:id" , verifyToken ,deleteUser)
router.post("/logout" , logoutUser)

module.exports = router;