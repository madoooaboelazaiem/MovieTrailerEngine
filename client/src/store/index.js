import Vue from "vue"
import Vuex from "vuex"
import VuexPersistence from "vuex-persist"
import axios from "axios"
import api from "./api"
require("dotenv").config()
Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  key: "basicData",
  storage: window.sessionStorage,
})

export default new Vuex.Store({
  state: {
    user_id: null,
    type: null,
    token: null,
    movies: [],
    trending: [],
    selectedMovie: {},
  },
  getters: {
    getUserId(state) {
      return state.user_id
    },
    getUserType(state) {
      return state.type
    },
    getToken(state) {
      return state.token
    },
    getMovies(state) {
      return state.movies
    },
    getTrending(state) {
      return state.trending
    },
    getSelectedMovie(state) {
      return state.selectedMovie
    },
  },
  mutations: {
    setUserId(state, value) {
      state.user_id = value
    },
    setUserType(state, value) {
      state.type = value
    },
    setSelectedMovie(state, value) {
      state.selectedMovie = value
    },
    setToken(state, value) {
      state.token = value
    },
    logout(state) {
      state.user_id = null
      state.token = null
      state.type = null
    },
    setMovies(state, value) {
      state.movies = value
    },
    setTrending(state, value) {
      state.trending = value
    },
  },
  actions: {
    async fetchMoviesTMDB(context) {
      await axios
        .get(process.env.VUE_APP_tmdb_URI)
        .then((res) => {
          console.log(res)
          if (res.status == 200) {
            context.commit("setTrending", res.data.results)
          }
        })
        .catch((err) => console.log(err))
    },
    async fetchMovies(context) {
      await api()
        .get(`movies/`)
        .then((res) => {
          if (res.data.status == "success") {
            var data = res.data.data
            context.commit("setMovies", data)
          }
        })
        .catch((err) => console.log(err))
    },
  },
  plugins: [vuexLocal.plugin],
})
