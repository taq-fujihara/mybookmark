import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Edit from "../views/Edit.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/bookmarks",
    name: "bookmarks",
    component: Home
  },
  {
    path: "/bookmarks/edit/:id?",
    name: "edit",
    component: Edit,
    props: true
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name === "home") {
    next("/bookmarks");
    return;
  }

  next();
});

export default router;
