"use strict"

const Model = require("objection").Model

class Movie extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "movies"
  }

  static findMovieByNameAndYearAndDirector(name, year, director) {
    return Movie.query().findOne({ name, year, director })
  }
  static findMovieByName(name) {
    return Movie.query().findOne({ name })
  }
  static getMoviesByName(name) {
    return Movie.query().select("*").where("name", "=", name)
  }
  static getAllMovies() {
    return Movie.query().select("*").orderBy("id", "desc")
  }
  static findMovieById(id) {
    if (id == null || typeof id !== "number") {
      throw new Error("can;t all findMovieById with null id")
    }
    return Movie.query().findOne({ id })
  }

  static createMovie(MovieParams) {
    return Movie.query().insert({
      name: MovieParams.name,
      year: MovieParams.year,
      description: MovieParams.description,
      director: MovieParams.director,
      trailer: MovieParams.trailer,
      image: MovieParams.image,
    })
  }
}

module.exports = Movie
