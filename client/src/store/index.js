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
  },
  mutations: {
    setUserId(state, value) {
      state.user_id = value
    },
    setUserType(state, value) {
      state.type = value
    },
    setToken(state, value) {
      state.token = value
    },
    logout(state) {
      state.user_id = null
      state.token = null
      state.type = null
      state.cart = []
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
        .get(
          "https://api.themoviedb.org/3/trending/movie/day?api_key=c33cf64a576bb3748c44f3f18deedcf1"
        )
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
