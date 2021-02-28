<template>
  <div class="row q-pa-sm">
    <div class="col-12">
      <div class="row justify-center">
        <div class="col-xs-12 col-md-6 ">
          <q-input
            rounded
            outlined
            dense
            v-model="searchText"
            color="white"
            class="q-my-md bg-white"
            placeholder="Search by Name"
          >
            <template v-slot:append>
              <q-icon v-if="searchText === ''" name="search" />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="searchText = ''"
              />
            </template>
          </q-input>
        </div>
      </div>
      <div
        v-if="outputMovies && outputMovies.length > 0"
        class="row justify-evenly"
      >
        <q-card
          class="col-xs-12 col-md-3 q-my-md"
          :class="{
            'q-ml-sm': $q.screen.gt.sm,
            'animated swing': animation,
          }"
          v-for="(movie, index) in outputMovies"
          :key="index"
        >
          <div class="column justify-between" style="height:100%;">
            <div class="col-shrink">
              <q-img
                :src="movie.image"
                :ratio="16 / 9"
                placeholder-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg=="
                spinner-color="white"
                style="height: 300px; max-width:100%"
              />
              <q-card-section>
                <div class="row justify-between">
                  <div class="col-shrink text-subtitle1 text-weight-bold">
                    {{ movie.name }}
                  </div>
                  <div class="col-shrink text-subtitle1">
                    {{ movie.year }}
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                {{ movie.description }}
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
                  v-model="movie.favourites"
                  round
                  class="bg-white"
                  :class="movie.favourites ? 'text-orange' : ''"
                  icon="grade"
                  @click="addAndRemoveFromFavourites(movie)"
                ></q-btn>
              </q-card-actions>
            </div>
          </div>
        </q-card>
      </div>
      <div v-else>
        <div class="row justify-center text-white">Button</div>
      </div>
    </div>
    <div class="col-12" v-if="$q.platform.is.mobile">
      <div class="row justify-end">
        <q-btn
          size="sm"
          class=" col-shrink bg-primary text-white q-mx-sm q-mb-md"
          @click="showFiltersCard = !showFiltersCard"
          icon="sort"
          :label="showFiltersCard ? 'Hide Filters' : 'Show Filters'"
        ></q-btn>
      </div>
    </div>
    <q-dialog v-model="showMovieCard">
      <q-card style="width:80vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Movie:</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="showMovieCard">
          <div class="row jusitify-between">
            <div class="col">
              <div class="column">
                <div class="col">Name : {{ selectedMovie.name }}</div>
                <div class="col">
                  Category: {{ selectedMovie.Category.name }}
                </div>
                <div class="col">Brand: {{ selectedMovie.Brand.name }}</div>
                <div class="col">Model: {{ selectedMovie.Model.name }}</div>
                <div class="col">Price: {{ selectedMovie.price }} EGP</div>
              </div>
            </div>
            <div class="col-shrink ">
              <div class="row items-center" style="height:100%;">
                <div class="col">
                  <q-btn
                    round
                    dense
                    class="bg-red-8 text-white"
                    size="md"
                    icon="remove"
                    :disable="selectedMovie.countOfMovies == 1"
                    @click="decrementMovieCount"
                  />
                </div>
                <div class="col-shrink">
                  <div class="text-h6 q-px-sm">
                    {{ selectedMovie.countOfMovies }}
                  </div>
                </div>
                <div class="col">
                  <q-btn
                    round
                    dense
                    class="bg-green-14 text-white"
                    size="md"
                    icon="add"
                    @click="incrementMovieCount"
                    :disable="
                      selectedMovie.stock <= selectedMovie.countOfMovies
                    "
                    :title="
                      selectedMovie.stock <= selectedMovie.countOfMovies
                        ? 'There are no more available Movies'
                        : ''
                    "
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class=" row q-mt-md items-center"
            :class="{ row: !$q.platform.is.mobile }"
          >
            <div class="col-auto">
              Total Price:
              {{ selectedMovie.price * selectedMovie.countOfMovies }}
              EGP
            </div>
            <q-space />
            <div class="col-shrink">
              <q-btn
                dense
                class="bg-green-14 text-white"
                :size="$q.screen.gt.xs ? 'md' : 'sm'"
                icon="add"
                label="Add To Cart"
                @click="addObjectToCart"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
export default {
  name: "Search",
  components: {},
  data() {
    return {
      databaseMovies: [],
      searchText: "",
      animation: false,
      intervalMin: 0,
      intervalMax: 0,
      priceRange: {
        min: 0,
        max: 0,
      },
      tempMovies: [],
      currentFilters: [],
      clearData: false,
      showFiltersCard: true,
      showMovieCard: false,
      showDeleteDialog: false,
      selectedMovie: { name: "" },
      brandsContainer: {},
      categoriesContainer: {},
      // modelsContainer: [],
      displayCategories: [],
      displayBrands: [],
      displayModels: [],
      rawOrder: [],
      pureCategories: [],
      pureBrands: [],
      pureModels: [],
      showSortByPrice: false,
    }
  },
  methods: {
    async getData() {
      await Promise.all([
        this.$store.dispatch("fetchMoviesTMDB"),
        this.$store.dispatch("addMovies"),
      ])
      await Promise.all([this.$store.dispatch("fetchMovies")])

      var data = JSON.parse(JSON.stringify(this.$store.getters.getMovies))
      // var favouritesData = JSON.parse(
      //   JSON.stringify([]) //this.$store.getters.getFavourites
      // )
      data.forEach((movie) => {
        if (!movie.favourites) movie.favourites = false
      })
      this.tempMovies = data
    },
    clicked() {
      this.animation = !this.animation
      this.$forceUpdate()
      this.showLoading()
    },
    showLoading() {
      // this.$q.loading.show();
      // setTimeout(() => {
      //   this.$q.loading.hide();
      // }, 2000);
      this.$q.loadingBar.start()
      // this.$q.loadingBar.stop();
      // this.$q.loadingBar.increment(50);
    },
    async addAndRemoveFromFavourites(value) {
      this.$store.commit("setSelectedMovie", value)
      console.log(value, "favourites")
      await this.$store.dispatch("editFavourites").then(async (res) => {
        this.$q.notify({
          type: res.status && res.status == "success" ? "positive" : "negative",
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
      // this.$store.commit("setSelectedMovie", value)
      // this.$router.push({ name: "ViewTrailer" })
    },
    shareClicked(value) {
      // this.showMovieTrailer = true
      // this.selectedmovie = value
      this.$store.commit("setSelectedMovie", value)
      window.location.href =
        "https://www.facebook.com/sharer/sharer.php?u=" + value.trailer
    },
    editMovieClicked(value) {
      this.$store.commit("setSelectedMovie", value)
      this.$router.push({ name: "MovieEdit" })
    },
    viewMoreClicked(value) {
      this.$store.commit("setSelectedMovie", value)
      this.$router.push({ name: "ViViewTrailerewMore" })
    },
  },
  computed: {
    allModels() {
      return this.$store.getters.getModels
    },
    outputMovies() {
      return this.filteredMovies.filter((Movie) => {
        if (this.searchText.length > 0) {
          return Movie.name
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        }
        return true
      })
    },
    filteredMovies() {
      return this.tempMovies
    },
    isAdmin() {
      return this.$store.getters.getUserType == "admin"
    },
  },
  async created() {
    await this.getData()
    if (this.$q.platform.is.mobile) {
      this.showFiltersCard = false
    }
  },
}
</script>

<style lang="scss" scoped>
.filter-card {
  &__head {
    font-weight: bold;
    font-size: 16px;
  }
}
.Movie-name {
  font-weight: bold;
  font-size: 16px;
}
</style>
