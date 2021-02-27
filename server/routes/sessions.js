const express = require("express")
const router = express.Router()
const session = require("../controllers/sessions")

router.post("/login", session.Login)
router.post("/resetPassword", session.resetPassword)

module.exports = router
