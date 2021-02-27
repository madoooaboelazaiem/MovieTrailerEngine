<template>
  <q-page>
    <div class="row justify-center q-ma"></div>
    <div class="row justify-center">
      <div class="col-xs-12 col-md-8">
        <div class="row">
          <div class="col-12 justify-around">
            <div class="row justify-evenly">
              <q-card
                class="col-xs-12 col-md-3 q-my-md"
                :class="{
                  'q-ml-sm': $q.screen.gt.sm,
                  'animated swing': animation,
                }"
                v-for="(movie, index) in movies"
                :key="index"
              >
                <div class="column justify-between" style="height:100%;">
                  <div class="col-shrink">
                    <q-img
                      :src="movie.fanart"
                      :ratio="16 / 9"
                      placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="
                      spinner-color="white"
                      style="height: 300px; max-width:100%"
                    />
                    <q-card-section>
                      <div class="row justify-between">
                        <div class="col-shrink text-subtitle1 text-weight-bold">
                          {{ movie.original_title }}
                        </div>
                        <div class="col-shrink text-subtitle1">
                          {{ movie.vote_average }}
                        </div>
                      </div>
                    </q-card-section>
                    <q-card-section class="q-pt-none">
                      {{ movie.name }}
                    </q-card-section>
                    <q-card-section class="q-pt-none">
                      {{ movie.overview }}
                    </q-card-section>
                  </div>
                  <div class="col-shrink">
                    <q-card-actions class="row justify-center">
                      <q-btn
                        class="bg-indigo-6 text-white q-mx-sm"
                        v-if="$q.screen.gt.sm"
                        @click="viewTrailerClicked(movie)"
                        >Trailer</q-btn
                      >
                      <q-btn
                        round
                        class="bg-indigo-6 text-white q-mx-xs"
                        icon="movie"
                        v-else
                        @click="viewTrailerClicked(movie)"
                      ></q-btn>
                      <q-btn
                        class="bg-green-7 text-white"
                        @click="shareClicked(movie)"
                        v-if="$q.screen.gt.sm"
                        >Share</q-btn
                      >
                      <q-btn
                        round
                        class="bg-green-7 text-white"
                        icon="share"
                        v-else
                        @click="shareClicked(movie)"
                      ></q-btn>
                      <q-btn
                        v-model="movie.favourite"
                        round
                        class="bg-white"
                        :class="movie.favourite ? 'text-orange' : ''"
                        icon="grade"
                        @click="addAndRemoveFromFavourites(movie)"
                      ></q-btn>
                    </q-card-actions>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
// import api from "../store/api";
// import axios from "axios";
export default {
  name: "Movies",
  data() {
    return {
      movies: [],
      animation: false,
      showMovieTrailer: false,
      selectedmovie: {},
      slide: 1,
      ratingModel: 0,
    }
  },
  methods: {
    async getData() {
      await Promise.all([
        this.$store.dispatch("fetchMoviesTMDB"),
        this.$store.dispatch("fetchFavourites"),
      ])

      var data = JSON.parse(JSON.stringify(this.$store.getters.getTrending))
      var favouritesData = JSON.parse(
        JSON.stringify([]) //this.$store.getters.getFavourites
      )
      data.forEach((movie) => {
        favouritesData.forEach((favourite) => {
          if (movie.id == favourite.movie_id) {
            movie.favourite = true
          }
        })
        if (!movie.favourite) movie.favourite = false
        movie.fanart = `https://image.tmdb.org/t/p/original${movie.poster_path}`
      })
      this.movies = data
    },
    clicked() {
      this.animation = !this.animation
      this.$forceUpdate()
      this.showLoading()
    },
    showLoading() {
      this.$q.loadingBar.start()
      // this.$q.loadingBar.stop();
      // this.$q.loadingBar.increment(50);
    },
    async addAndRemoveFromFavourites() {
      await this.$store
        .dispatch("editFavourites", this.selectedmovie.id)
        .then(async (res) => {
          this.$q.notify({
            type:
              res.status && res.status == "success" ? "positive" : "negative",
            message: res.message ? res.message : "Error Occured",
            timeout: 2000,
          })
          if (res.status == "success") {
            await this.getData()
          }
        })
    },
    viewTrailerClicked(value) {
      this.showMovieTrailer = true
      this.selectedmovie = value
      // this.$store.commit("setSelectedmovie", value)
      // this.$router.push({ name: "ViewTrailer" })
    },
    shareClicked(value) {
      // this.showMovieTrailer = true
      // this.selectedmovie = value
      this.$store.commit("setSelectedmovie", value)
      window.location.href =
        "https://www.facebook.com/sharer/sharer.php?u=" +
        "https://www.youtube.com/watch?v=CFGjn3yKMNc"
    },
  },
  created() {
    this.getData()
  },
  computed: {
    QuasarObj() {
      return this.$q
    },
    isAdmin() {
      return this.$store.getters.getUserType == "admin"
    },
    isLoggedIn() {
      return this.$store.getters.getToken
    },
  },
}
</script>
<style lang="scss" scoped>
.q-page {
  background-color: black;
}
.my-card {
  width: 100%;
  max-width: 250px;
}
</style>
