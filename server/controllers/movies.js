const bcrypt = require("bcryptjs")
const MovieModel = require("../models/Movie")
const fs = require("fs")
const path = require("path")
require("dotenv").config()
const config = require("../config/setup")
const addMovie = async function (req, res) {
  var valid_params =
    req.body &&
    req.body.name &&
    req.body.year &&
    req.body.director &&
    req.body.description
  if (!valid_params) {
    return res
      .status(400)
      .send({ status: "failure", message: "movie parameters are missing" })
  } else {
    // TODO Add Trailer
    const newMovie = await MovieModel.addMovie(req.body)
    return res.status(200).send({
      status: "success",
      message: "Movie added successfully",
      data: newMovie,
    })
  }
}
const getAllMovies = async (req, res) => {
  try {
    const allMovies = await MovieModel.getAllMovies()
    if (allMovies) {
      return res.status(200).send({ status: "success", data: allMovies })
    } else {
      return res
        .status(400)
        .send({ status: "failure", message: "Error while fetching Movies" })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      status: "failure",
      message: "Error occurred while fetching Movies",
    })
  }
}
const searchForMovie = async (req, res) => {
  try {
    const checkIfMovieExists = await MovieModel.findMovieByNameAndYearAndDirector(
      req.body.name,
      req.body.year,
      req.body.description
    )
    if (checkIfMovieExists)
      return res
        .status(200)
        .send({ status: "success", data: checkIfMovieExists })
    else {
      //TODO Get movie data from moviedb or imdb
      // Get its trailer
      // Add it to database and return added data
    }
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      status: "failure",
      message: "Error occurred while fetching movie information",
    })
  }
}

module.exports = {
  addMovie,
  getAllMovies,
  searchForMovie,
}
