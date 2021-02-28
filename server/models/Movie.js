"use strict"

const Model = require("objection").Model
const movieTrailer = require("movie-trailer") // or import movieTrailer from 'movie-trailer'

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
  static getFavourites() {
    return Movie.query().select("*").where("favourites", "=", true)
  }
  static addMovie(MovieParams) {
    return Movie.query().insert({
      name: MovieParams.name,
      year: MovieParams.year,
      description: MovieParams.description,
      trailer: MovieParams.trailer,
      image: MovieParams.image,
      tmdb_id: MovieParams.tmdb_id,
    })
  }
  static async addMovies(MovieParams) {
    const insertion = await Promise.all(
      MovieParams.map(async (movie) => {
        var addMovies = []
        var find = await Movie.query().findOne({
          tmdb_id: movie.tmdb_id,
        })
        if (!find) {
          const trailer = await movieTrailer(null, {
            tmdbId: parseInt(movie.tmdb_id),
          })
          movie.trailer = trailer
          var year = new Date(movie.year)
          movie.year = year.getFullYear()
          const imageURL = "https://image.tmdb.org/t/p/original"
          movie.image = imageURL + movie.image
          var movies = await Movie.query()
            .insertAndFetch({
              name: movie.name,
              year: movie.year,
              description: movie.description,
              trailer: movie.trailer,
              image: movie.image,
              tmdb_id: movie.tmdb_id,
            })
            .then((res) => {
              addMovies.push(res)
            })
        } else {
          const trailer = await movieTrailer(null, {
            tmdbId: parseInt(movie.tmdb_id),
          })
          movie.trailer = trailer
          var year = new Date(movie.year)
          movie.year = year.getFullYear()
          const imageURL = "https://image.tmdb.org/t/p/original"
          movie.image = imageURL + movie.image
          addMovies.push(movie)
        }
        return addMovies
      })
    ).catch((e) => {
      throw new Error(e)
    })
    return insertion
  }
  static async updateMovie(MovieParams) {
    var find = await Movie.query().findOne({
      tmdb_id: MovieParams.tmdb_id,
    })
    var insert = await find.$query().updateAndFetch({
      favourites: !MovieParams.favourites,
    })
    return insert
  }
}

module.exports = Movie
