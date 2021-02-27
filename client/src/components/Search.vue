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
                  @click="viewMoreClicked(movie)"
                  >Trailer</q-btn
                >
                <q-btn
                  round
                  class="bg-indigo-6 text-white q-mx-xs"
                  icon="movie"
                  v-else
                  @click="viewMoreClicked(movie)"
                ></q-btn>
                <q-btn
                  class="bg-green-7 text-white"
                  @click="addToCartClicked(movie)"
                  v-if="$q.screen.gt.sm"
                  >Share</q-btn
                >
                <q-btn
                  round
                  class="bg-green-7 text-white"
                  icon="share"
                  v-else
                  @click="addToCartClicked(movie)"
                ></q-btn>
                <!-- <div class="q-pa-md">
                  <q-rating
                    v-model="ratingModel"
                    size="2em"
                    :max="1"
                    color="warning"
                    @click="addAndRemoveFromFavourites()"
                  >
                  </q-rating>
                </div> -->
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
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want to delete this Movie?</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="No"
            color="primary"
            v-close-popup
            @click="deleteAction(1)"
          />
          <q-btn
            flat
            label="Yes"
            color="primary"
            @click="deleteAction(2)"
            v-close-popup
          />
        </q-card-actions>
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
    async pageCreated() {
      await this.$store.dispatch("fetchMoviesTMDB")
      var allMovies = this.$store.getters.getMovies
      var currentCar = this.$store.getters.getCart
      var tempCategories = []
      var tempBrands = []
      var tempModels = []
      var maxPrice = 0
      var data = []
      allMovies.forEach((Movie) => {
        currentCar.forEach((cartObj) => {
          if (cartObj.Movie && cartObj.Movie.id == Movie.id) {
            Movie.stock -= cartObj.count
          }
        })
        if (Movie.price > maxPrice) {
          maxPrice = Movie.price
        }
        data.push({
          Category: Movie.Category,
          Brand: Movie.Brand,
          Model: Movie.Model,
        })
        if (this.brandsContainer[Movie.Brand.name])
          this.brandsContainer[Movie.Brand.name].push(Movie.Model)
        else this.brandsContainer[Movie.Brand.name] = [Movie.Model]
        if (this.categoriesContainer[Movie.Category.name])
          this.categoriesContainer[Movie.Category.name].push(Movie.Brand)
        else this.categoriesContainer[Movie.Category.name] = [Movie.Brand]

        tempModels.push(Movie.Model)
        tempCategories.push(Movie.Category)
        tempBrands.push(Movie.Brand)
      })
      this.rawOrder = data
      Object.keys(this.categoriesContainer).forEach((key) => {
        // eslint-disable-next-line no-unused-vars
        var currentArray = this.categoriesContainer[key]
        currentArray = Object.values(
          currentArray.reduce(
            (acc, cur) => Object.assign(acc, { [cur.name]: cur }),
            {}
          )
        )
        this.categoriesContainer[key] = currentArray
      })
      Object.keys(this.brandsContainer).forEach((key) => {
        // eslint-disable-next-line no-unused-vars
        var currentArray = this.brandsContainer[key]
        currentArray = Object.values(
          currentArray.reduce(
            (acc, cur) => Object.assign(acc, { [cur.name]: cur }),
            {}
          )
        )
        this.brandsContainer[key] = currentArray
      })

      allMovies = allMovies.filter((Movie) => Movie.stock > 0)
      this.intervalMax = maxPrice
      this.priceRange.max = maxPrice
      this.databaseMovies = allMovies
      this.tempMovies = allMovies
      tempCategories = Object.values(
        tempCategories.reduce(
          (acc, cur) => Object.assign(acc, { [cur.name]: cur }),
          {}
        )
      )
      tempBrands = Object.values(
        tempBrands.reduce(
          (acc, cur) => Object.assign(acc, { [cur.name]: cur }),
          {}
        )
      )
      tempModels = Object.values(
        tempModels.reduce(
          (acc, cur) => Object.assign(acc, { [cur.name]: cur }),
          {}
        )
      )
      this.displayCategories = tempCategories
      this.displayBrands = tempBrands
      this.displayModels = tempModels
      this.pureCategories = JSON.parse(JSON.stringify(tempCategories))
      this.pureBrands = JSON.parse(JSON.stringify(tempBrands))
      this.pureModels = JSON.parse(JSON.stringify(tempModels))
    },

    async getData() {
      await Promise.all([this.$store.dispatch("fetchMoviesTMDB")])

      var data = JSON.parse(JSON.stringify(this.$store.getters.getTrending))
      this.tempMovies = data
      // console.log(categoriesHolder);
      // console.log(brandsHolder);
      // console.log(brandsUbmrella);
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
    addToCartClicked(MovieObject) {
      var token = this.$store.getters.getToken
      if (!token) {
        this.$q.notify({
          type: "warning",
          message: "Please login or register to add Movies to your cart",
          timeout: 5000,
        })
        // setTimeout(() => {
        //   this.$router.push({ name: "Login" });
        // }, 1000);
      } else {
        this.showMovieCard = true
        MovieObject.countOfMovies = 1
        this.selectedMovie = MovieObject
      }
    },
    decrementMovieCount() {
      this.selectedMovie.countOfMovies--
      this.$forceUpdate()
    },
    incrementMovieCount() {
      if (this.selectedMovie.stock >= this.selectedMovie.countOfMovies + 1) {
        this.selectedMovie.countOfMovies++
      }

      this.$forceUpdate()
    },

    deleteMovie(Movie) {
      this.showDeleteDialog = true
      this.selectedMovie = Movie
    },
    async deleteAction(value) {
      if (value == 2) {
        await this.$store
          .dispatch("deleteMovie", this.selectedMovie.id)
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
      }
      this.showDeleteDialog = false
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
          return Movie.title
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
