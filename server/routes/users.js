const express = require("express")
const router = express.Router()
const middleware = require("../middleware/login")

const users = require("../controllers/users")

router.post("/", users.userSignup)
router.get("/", middleware.verifyToken, users.viewProfile)

module.exports = router
