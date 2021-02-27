<template>
  <q-layout view="lhh lpR lff">
    <q-header reveal elevated class="bg-blue-grey-10">
      <q-toolbar class="row justify-between">
        <div class="col-shrink">
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
            icon="fas fa-bars"
            v-if="isAdmin"
          />
          <q-toolbar-title
            class="title-head"
            shrink
            @click="$router.push({ name: 'Movies' })"
          >
            <q-avatar>
              <img style="height:30px;" src="../assets/iconOnly.png" />
            </q-avatar>
            CouchPotato
          </q-toolbar-title>
        </div>
        <div class="col-shrink" v-if="isLoggedIn">
          <q-btn
            dense
            color="none"
            flat
            round
            icon="search"
            class="q-mr-xs"
            @click="searchClicked"
          >
            <q-tooltip v-if="!$q.platform.is.mobile">
              <span class="text-subtitle2">Search</span>
            </q-tooltip>
          </q-btn>
          <q-btn
            dense
            color="none"
            flat
            round
            icon="shopping_cart"
            class="q-mr-xs"
            v-if="!isAdmin"
          >
            <q-tooltip v-if="!$q.platform.is.mobile">
              <span class="text-subtitle2">Cart</span>
            </q-tooltip>
            <q-badge color="red-8" floating v-if="currentCart.length > 0">{{
              currentCart.length
            }}</q-badge>
            <q-menu>
              <q-list style="min-width:200px">
                <q-item v-for="(cartItem, index) in currentCart" :key="index">
                  <q-item-section avatar>
                    <q-avatar rounded>
                      <img
                        :src="
                          cartItem.product.images
                            ? cartItem.product.images[0].img
                            : ''
                        "
                      />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section class="col-shrink"
                    >{{ cartItem.count }} x
                    {{ cartItem.product.name }}</q-item-section
                  >
                </q-item>
                <q-separator />
                <q-item v-if="currentCart.length > 0">
                  <q-item-section>
                    <q-btn
                      dense
                      class="bg-green-7 text-white"
                      label="View Cart"
                      @click="$router.push({ name: 'Cart' })"
                    ></q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn
            icon="account_circle"
            dense
            color="none"
            flat
            round
            class="mouseHover"
          >
            <q-tooltip v-if="!$q.platform.is.mobile">
              <span class="text-subtitle2">Options</span>
            </q-tooltip>
            <q-menu>
              <q-list
                >couchpotato
                <q-item clickable v-close-popup>
                  <q-item-section @click="logout">Logout</q-item-section>
                </q-item>
                <!-- <q-item clickable v-close-popup>
                  <q-item-section>New incognito tab</q-item-section>
                </q-item>
                <q-separator /> -->
                <q-separator />
                <q-item
                  clickable
                  v-close-popup
                  v-if="!isAdmin"
                  no-wrap
                  @click="changeRoute('MyOrders')"
                >
                  <q-item-section>View My Orders</q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-close-popup
                  v-if="!isAdmin"
                  @click="changeRoute('Profile')"
                >
                  <q-item-section>My Profile</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <div class="col-shrink" v-else>
          <q-btn
            dense
            color="none"
            flat
            round
            icon="search"
            class="q-mr-xs"
            @click="searchClicked"
          >
            <q-tooltip v-if="!$q.platform.is.mobile">
              <span class="text-subtitle2">Search</span>
            </q-tooltip>
          </q-btn>
          <div
            class="text-body1 header-text q-mx-xs"
            @click="changeRoute('Login')"
          >
            Login
          </div>
          or
          <div
            class="text-body1 header-text q-mx-xs"
            @click="changeRoute('Register')"
          >
            Register
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :breakpoint="700"
      elevated
      content-class="bg-grey-2"
      behavior="mobile"
    >
      <q-list>
        <q-item-label header>CouchPotato</q-item-label>
        <q-item clickable @click="changeRoute('RequestTrailer')">
          <q-item-section avatar>
            <q-icon name="add_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Request Trailer</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable @click="changeRoute('Categories')">
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Favourites</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "Default",
  components: {},

  data() {
    return {
      leftDrawerOpen: true,
    }
  },
  methods: {
    changeRoute(routeName) {
      this.$router.push({ name: routeName })
    },
    logout() {
      this.$store.commit("logout")
      this.$router.push({ name: "Default" })
    },
    searchClicked() {
      this.$router.push({ name: "Search" })
    },
  },
  created() {
    this.$q.addressbarColor.set("#1467ba")
  },
  computed: {
    isAdmin() {
      const userType = this.$store.getters.getUserType
      return userType == "admin"
    },
    isLoggedIn() {
      return this.$store.getters.getToken
    },
    currentCart() {
      return this.$store.getters.getCart
    },
  },
}
</script>

<style lang="scss" scoped>
.q-layout {
  background-color: black;
  // height: 50px;
}
.title-head {
  display: inline;
  &:hover {
    cursor: pointer;
  }
}
.header-text {
  font-size: 16px;
  display: inline;
  &:hover {
    cursor: pointer;
    color: rgb(209, 205, 205);
  }
}
.mouseHover {
  &:hover {
    cursor: pointer;
  }
}
</style>
