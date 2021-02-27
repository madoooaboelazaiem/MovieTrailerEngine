const express = require("express")
const router = express.Router()
const middleware = require("../middleware/login")

const movies = require("../controllers/movies")

router.post("/", movies.addMovie)
router.get("/", movies.searchForMovie)

module.exports = router
