const express = require("express")
const router = express.Router()
const movies = require("../controllers/movies")

router.post("/", movies.addMovie)
router.put("/", movies.editMovie)
router.get("/", movies.getAllMovies)
router.get("/favourites", movies.getFavourites)

router.post("/requestTrailer", movies.requestTrailer)

module.exports = router
