const express = require("express")
const router = express.Router()
const middleware = require("../middleware/login")

const users = require("../controllers/users")

router.post("/signup", users.signUp)

module.exports = router
