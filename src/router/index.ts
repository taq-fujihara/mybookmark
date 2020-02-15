import Vue from "vue";
import VueRouter from "vue-router";
import Auth from "../views/Auth.vue";
import Home from "../views/Home.vue";
import Edit from "../views/Edit.vue";
import Tags from "../views/Tags.vue";
import TagEdit from "../views/TagEdit.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/auth",
    name: "auth",
    component: Auth
  },
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/bookmarks",
    name: "bookmarks",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/bookmarks/edit/:id?",
    name: "edit",
    component: Edit,
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/tags",
    name: "tags",
    component: Tags,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/tags/edit/:id",
    name: "tagEdit",
    component: TagEdit,
    props: true,
    meta: {
      requiresAuth: true
    }
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
  const hasAuthed = !!store.state.user.id;

  if (to.name === "auth" && hasAuthed) {
    next("/");
    return;
  }

  if (to.meta.requiresAuth) {
    if (!hasAuthed) {
      next("/auth");
      return;
    }
  }

  if (to.name === "home") {
    next("/bookmarks");
    return;
  }

  next();
});

export default router;
