<template>
  <div class="row">
    <div class="col-2" v-if="$q.screen.gt.sm"></div>
    <div class=" q-pa-md" :class="$q.screen.gt.sm ? 'col-8' : 'col-12'">
      <div class="row justify-center">
        <div :class="$q.screen.gt.sm ? 'col-8' : 'col-12'">
          <div class="row text-h5 q-mb-md">
            Request Trailer
          </div>
          <div>
            <q-card class=" bg-grey-1 row q-mb-sm" style="width:100%;">
              <div class="col-12">
                <q-card-section class=" col-12 ">
                  <div class="row">
                    <div class="col  ">
                      <q-input
                        bg-color="white"
                        outlined
                        v-model="name"
                        label="Movie Name"
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class=" col-12 ">
                  <div class="row">
                    <div class="col  ">
                      <q-input
                        bg-color="white"
                        outlined
                        v-model="description"
                        label="Description"
                        type="textarea"
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class=" col-12 ">
                  <div class="row">
                    <div class="col  ">
                      <q-input
                        bg-color="white"
                        outlined
                        v-model="stock"
                        label="Year"
                        type="number"
                      />
                    </div>
                  </div>
                </q-card-section>
              </div>
              <div class="col-12">
                <div class="row justify-center " style="height:100%;">
                  <div class="col-shrink">
                    <div class="row">
                      <div class="col-shrink q-my-sm q-mx-xs">
                        <q-btn
                          color="green-7"
                          label="Add Request"
                          :size="$q.platform.is.mobile ? 'sm' : 'md'"
                          @click="createNewProduct"
                        />
                      </div>
                      <div class="col-shrink q-my-sm q-mx-xs">
                        <q-btn
                          color="negative"
                          label="Clear"
                          :size="$q.platform.is.mobile ? 'xs' : 'md'"
                          @click="clearAllData"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </div>
    <div class="col-2" v-if="$q.screen.gt.sm"></div>
  </div>
</template>

<script>
import api from "../store/api"
export default {
  name: "RequestTrailer",
  components: {},
  data() {
    return {
      name: "",
      description: "",
      price: "",
      stock: "",
      category: null,
      brand: null,
      model: null,
      imageInputs: [{ distinctNumber: 0 }],
      imageLinks: [{ distinctNumber: 10, link: "" }],
      distinctNumberGenerator: 1,
      value: false,
      dataEraser: false,
    }
  },
  methods: {
    async createNewProduct() {
      if (
        !this.name ||
        this.name.length == 0 ||
        !this.description ||
        this.description.length == 0 ||
        !this.price ||
        this.price.length == 0 ||
        !this.stock ||
        this.stock.length == 0 ||
        !this.category ||
        !this.brand ||
        !this.model
      ) {
        this.$q.notify({
          type: "negative",
          message: "Parameter(s) missing",
          timeout: 2000,
        })
        return
      }
      var apiObject = {
        name: this.name && this.name.length > 0 ? this.name : null,
        description:
          this.description && this.description.length > 0
            ? this.description
            : null,
        price: this.price && this.price.length > 0 ? this.price : null,
        stock: this.stock && this.stock.length > 0 ? this.stock : null,
        category_id:
          this.category && this.category.name ? this.category.id : null,
        brand_id: this.brand && this.brand.name ? this.brand.id : null,
        model_id: this.model && this.model.name ? this.model.id : null,
      }
      var images = []
      this.imageInputs.forEach((obj) => {
        if (obj.image_url && obj.image_url.length > 0) {
          images.push(obj.image_url)
        }
        // console.log(JSON.parse(JSON.stringify(obj)));
      })
      this.imageLinks.forEach((obj) => {
        if (obj.link && obj.link.length > 0) {
          images.push(obj.link)
        }
      })
      apiObject.images = images
      if (images.length == 0) {
        this.$q.notify({
          type: "negative",
          message: "Product images are missing",
          timeout: 2000,
        })
        return
      }
      await api()
        .post(`products/createProduct`, apiObject)
        .then((res) => {
          if (res.data.status && res.data.status == "success") {
            this.$q.notify({
              type: "positive",
              message: "Product created successfully",
              timeout: 2000,
            })
            this.clearAllData()
          }
        })
        .catch((err) => {
          const response = err.response.data
          this.$q.notify({
            type: "negative",
            message: response.message,
            timeout: 2000,
          })
        })
    },

    clearAllData() {
      this.name = ""
      this.description = ""
      this.price = ""
      this.stock = ""
      this.category = null
      this.brand = null
      this.model = null
      this.imageInputs = [{ distinctNumber: this.distinctNumberGenerator++ }]
      this.imageLinks = [
        { distinctNumber: this.distinctNumberGenerator++, link: "" },
      ]
      this.dataEraser = true
      setTimeout(() => {
        this.dataEraser = false
      }, 100)
    },
    // imageLinkInput(value, dis) {
    //   var inputIndex = -1;
    //   this.imageLinks.forEach((input, index) => {
    //     if (input.distinctNumber == dis) {
    //       inputIndex = index;
    //     }
    //   });
    //   if (inputIndex !== -1) {
    //     this.imageLinks[inputIndex].link = value;
    //   }
    // }
  },
  computed: {
    availableCategories() {
      return this.$store.getters.getCategories
    },
    availableBrands() {
      return this.$store.getters.getBrands
    },
    availableModels() {
      return this.$store.getters.getModels
    },
  },
  created() {
    window.scrollTo(0, 0)
  },
}
</script>

<style></style>
