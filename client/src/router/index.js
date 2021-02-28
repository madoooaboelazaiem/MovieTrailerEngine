import Vue from "vue"
import VueRouter from "vue-router"
import Movies from "../views/Movies.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Default",
    component: () => import("../views/Default.vue"),
    children: [
      {
        path: "/",
        name: "Movies",
        component: Movies,
      },

      {
        path: "/requestTrailer",
        name: "RequestTrailer",
        component: () => import("../components/RequestTrailer.vue"),
      },
      {
        path: "/searchProduct",
        name: "Search",
        component: () => import("../components/Search.vue"),
      },
      {
        path: "/viewFavourites",
        name: "ViewFavourites",
        component: () => import("../components/Favourites.vue"),
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/User/Login"),
  },
  {
    path: "/shareTrailer",
    name: "ShareTrailer",
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/User/Register"),
  },
  {
    path: "/resetPassword",
    name: "ResetPassword",
    props: true,
    component: () => import("../views/User/ResetPassword.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

export default router
