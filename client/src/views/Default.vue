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

                <q-separator />
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
      content-class="bg-grey-4"
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
        <q-item clickable @click="changeRoute('ViewFavourites')">
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
