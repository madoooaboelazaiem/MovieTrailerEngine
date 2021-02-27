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
    <q-dialog v-model="showProductCard">
      <q-card style="width:80vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Product:</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="showProductCard">
          <div class="row jusitify-between">
            <div class="col">
              <div class="column">
                <div class="col">Name : {{ selectedProduct.name }}</div>
                <div class="col">
                  Category: {{ selectedProduct.Category.name }}
                </div>
                <div class="col">Brand: {{ selectedProduct.Brand.name }}</div>
                <div class="col">Model: {{ selectedProduct.Model.name }}</div>
                <div class="col">Price: {{ selectedProduct.price }} EGP</div>
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
                    :disable="selectedProduct.countOfProducts == 1"
                    @click="decrementProductCount"
                  />
                </div>
                <div class="col-shrink">
                  <div class="text-h6 q-px-sm">
                    {{ selectedProduct.countOfProducts }}
                  </div>
                </div>
                <div class="col">
                  <q-btn
                    round
                    dense
                    class="bg-green-14 text-white"
                    size="md"
                    icon="add"
                    @click="incrementProductCount"
                    :disable="
                      selectedProduct.stock <= selectedProduct.countOfProducts
                    "
                    :title="
                      selectedProduct.stock <= selectedProduct.countOfProducts
                        ? 'There are no more available products'
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
              {{ selectedProduct.price * selectedProduct.countOfProducts }}
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
            >Are you sure you want to delete this product?</span
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
      databaseProducts: [],
      searchText: "",
      animation: false,
      intervalMin: 0,
      intervalMax: 0,
      priceRange: {
        min: 0,
        max: 0,
      },
      tempProducts: [],
      currentFilters: [],
      clearData: false,
      showFiltersCard: true,
      showProductCard: false,
      showDeleteDialog: false,
      selectedProduct: { name: "" },
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
      await this.$store.dispatch("fetchProducts")
      var allProducts = this.$store.getters.getProducts
      var currentCar = this.$store.getters.getCart
      var tempCategories = []
      var tempBrands = []
      var tempModels = []
      var maxPrice = 0
      var data = []
      allProducts.forEach((product) => {
        currentCar.forEach((cartObj) => {
          if (cartObj.product && cartObj.product.id == product.id) {
            product.stock -= cartObj.count
          }
        })
        if (product.price > maxPrice) {
          maxPrice = product.price
        }
        data.push({
          Category: product.Category,
          Brand: product.Brand,
          Model: product.Model,
        })
        if (this.brandsContainer[product.Brand.name])
          this.brandsContainer[product.Brand.name].push(product.Model)
        else this.brandsContainer[product.Brand.name] = [product.Model]
        if (this.categoriesContainer[product.Category.name])
          this.categoriesContainer[product.Category.name].push(product.Brand)
        else this.categoriesContainer[product.Category.name] = [product.Brand]

        tempModels.push(product.Model)
        tempCategories.push(product.Category)
        tempBrands.push(product.Brand)
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

      allProducts = allProducts.filter((product) => product.stock > 0)
      this.intervalMax = maxPrice
      this.priceRange.max = maxPrice
      this.databaseProducts = allProducts
      this.tempProducts = allProducts
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
      await Promise.all([
        this.$store.dispatch("fetchProducts"),
        this.$store.dispatch("fetchCategories"),
        this.$store.dispatch("fetchBrands"),
        this.$store.dispatch("fetchModels"),
      ])

      var data = this.$store.getters.getProducts
      var currentCart = this.$store.getters.getCart
      if (currentCart.length > 0) {
        currentCart.forEach((item) => {
          data.forEach((product) => {
            if (product.id == item.product.id) {
              product.stock -= item.count
            }
          })
        })
      }
      data = data.filter((product) => product.stock > 0)
      this.products = data
      var modelsHolder = {}
      var brandsHolder = {}
      var categoriesHolder = {}
      var brandsUbmrella = []
      data.forEach((product) => {
        if (!categoriesHolder[product.Category.name])
          categoriesHolder[product.Category.name] = {}
        if (!brandsHolder[product.Brand.name])
          brandsHolder[product.Brand.name] = {}
        if (!modelsHolder[product.Model.name])
          modelsHolder[product.Model.name] = {}
        if (brandsUbmrella[product.brand_id])
          brandsUbmrella[product.brand_id].push(product.Model)
        else brandsUbmrella[product.brand_id] = [product.Model]
      })
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
    addToCartClicked(productObject) {
      var token = this.$store.getters.getToken
      if (!token) {
        this.$q.notify({
          type: "warning",
          message: "Please login or register to add products to your cart",
          timeout: 5000,
        })
        // setTimeout(() => {
        //   this.$router.push({ name: "Login" });
        // }, 1000);
      } else {
        this.showProductCard = true
        productObject.countOfProducts = 1
        this.selectedProduct = productObject
      }
    },
    decrementProductCount() {
      this.selectedProduct.countOfProducts--
      this.$forceUpdate()
    },
    incrementProductCount() {
      if (
        this.selectedProduct.stock >=
        this.selectedProduct.countOfProducts + 1
      ) {
        this.selectedProduct.countOfProducts++
      }

      this.$forceUpdate()
    },
    addObjectToCart() {
      var currentCar = this.$store.getters.getCart
      var indexOfProduct = -1
      currentCar.forEach((cartObj, index) => {
        if (cartObj.product && cartObj.product.id == this.selectedProduct.id) {
          // cartObj.count += this.selectedProduct.countOfProducts;
          indexOfProduct = index
        }
      })
      this.tempProducts.forEach((singleProduct) => {
        if (singleProduct.id == this.selectedProduct.id) {
          singleProduct.stock -= this.selectedProduct.countOfProducts
        }
      })
      if (indexOfProduct !== -1) {
        currentCar[indexOfProduct].count += this.selectedProduct.countOfProducts
      } else {
        var temp = {
          count: this.selectedProduct.countOfProducts,
          product: this.selectedProduct,
          id: this.selectedProduct.id,
        }
        this.$store.commit("addToCart", temp)
      }
      this.$q.notify({
        type: "positive",
        message: "Product(s) added to cart",
        timeout: 3000,
      })
      this.showProductCard = false
    },
    deleteProduct(product) {
      this.showDeleteDialog = true
      this.selectedProduct = product
    },
    async deleteAction(value) {
      if (value == 2) {
        await this.$store
          .dispatch("deleteProduct", this.selectedProduct.id)
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
    editProductClicked(value) {
      this.$store.commit("setSelectedProduct", value)
      this.$router.push({ name: "ProductEdit" })
    },
    viewMoreClicked(value) {
      this.$store.commit("setSelectedProduct", value)
      this.$router.push({ name: "ViewMore" })
    },
    priceChanged() {
      this.applyFilters()
    },
    filterOptionSelected(value, index) {
      this.currentFilters[index] = value
      if (value[0] && value[0].name) {
        switch (index) {
          case 0:
            this.displayBrands = this.categoriesContainer[value[0].name]
            break
          case 1:
            var currentModels = JSON.parse(
              JSON.stringify(this.brandsContainer[value[0].name])
            )
            //console.log("currentModels", currentModels);
            var rawData = JSON.parse(JSON.stringify(this.rawOrder))
            //console.log("rawData", rawData);
            var selectedCategory = null
            if (this.currentFilters[0] && this.currentFilters[0][0]) {
              selectedCategory = JSON.parse(
                JSON.stringify(this.currentFilters[0][0])
              )
            }

            //console.log("selectedCategory", selectedCategory);
            var selectedBrand = JSON.parse(JSON.stringify(value[0]))
            currentModels = currentModels.filter((singleModel) => {
              var found = false
              rawData.forEach((x) => {
                if (
                  singleModel.name == x.Model.name &&
                  selectedBrand.name == x.Brand.name
                ) {
                  if (selectedCategory) {
                    if (selectedCategory.name == x.Category.name) {
                      found = true
                    }
                  } else {
                    found = true
                  }
                }
              })
              return found
            })
            this.displayModels = currentModels
            break
        }
      }

      this.applyFilters()
    },
    applyFilters() {
      var data = this.databaseProducts
      var currentFilters = this.currentFilters
      var currentPriceRange = this.priceRange
      if (currentFilters[0] && currentFilters[0].length > 0) {
        var categoryId = currentFilters[0][0].id
        data = data.filter((product) => {
          if (product.category_id == categoryId) return true
          return false
        })
      }
      if (currentFilters[1] && currentFilters[1].length > 0) {
        var brandId = currentFilters[1][0].id
        data = data.filter((product) => {
          if (product.brand_id == brandId) return true
          return false
        })
      }
      if (currentFilters[2] && currentFilters[2].length > 0) {
        var modelId = currentFilters[2][0].id
        data = data.filter((product) => {
          if (product.model_id == modelId) return true
          return false
        })
      }
      data = data.filter((product) => {
        if (
          product.price >= currentPriceRange.min &&
          product.price <= currentPriceRange.max
        ) {
          return true
        }
        return false
      })
      this.tempProducts = data
    },
    clearAllFilters() {
      this.clearData = true
      this.priceRange.min = this.intervalMin
      this.priceRange.max = this.intervalMax
      this.currentFilters = [[], [], []]
      this.tempProducts = []
      this.displayCategories = JSON.parse(JSON.stringify(this.pureCategories))
      this.displayBrands = JSON.parse(JSON.stringify(this.pureBrands))
      this.displayModels = JSON.parse(JSON.stringify(this.pureModels))
      setTimeout(() => {
        this.clearData = false
        this.tempProducts = this.databaseProducts
      }, 100)

      this.applyFilters()
    },
    sortByPrice(text) {
      if (text == "asc") {
        this.tempProducts = this.tempProducts.sort((a, b) => {
          if (a.price > b.price) {
            return 1
          }
          if (a.price < b.price) {
            return -1
          }
          return 0
        })
      } else {
        this.tempProducts = this.tempProducts.sort((a, b) => {
          if (a.price > b.price) {
            return -1
          }
          if (a.price < b.price) {
            return 1
          }
          return 0
        })
      }
    },
  },
  computed: {
    allCategories() {
      return this.$store.getters.getCategories
    },
    allBrands() {
      return this.$store.getters.getBrands
    },
    allModels() {
      return this.$store.getters.getModels
    },
    outputProducts() {
      return this.filteredProducts.filter((product) => {
        if (this.searchText.length > 0) {
          return product.name
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        }
        return true
      })
    },
    filteredProducts() {
      return this.tempProducts
    },
    isAdmin() {
      return this.$store.getters.getUserType == "admin"
    },
  },
  async created() {
    await this.pageCreated()
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
.product-name {
  font-weight: bold;
  font-size: 16px;
}
</style>
