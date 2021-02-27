import axios from "axios"

const TMDB = "https://api.themoviedb.org/3/"
const TMDB_KEY = process.env.TMDB_KEY

const params = {
  api_key: TMDB_KEY,
  append_to_response: "credits",
}

export function tmdb(type, id) {
  let url = TMDB
  url += `movie/${id}`

  return axios.get(url, { params })
}
