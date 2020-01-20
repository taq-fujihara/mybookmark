import Vue from "vue";
import Vuex, { Store } from "vuex";
import Bookmark from "@/models/Bookmark";
import repository from "@/repository";

Vue.use(Vuex);

let unsubscribe: () => void;

export default new Vuex.Store({
  state: {
    user: {
      id: "",
      email: ""
    },
    bookmarks: [] as Array<Bookmark>,
    bookmarksAllFetched: false
  },
  mutations: {
    setUser(state, user) {
      state.user.id = user.id;
      state.user.email = user.email;
    },
    clearUser(state) {
      state.user.id = "";
      state.user.email = "";
    },
    setBookmarks(state, bookmarks: Array<Bookmark>) {
      state.bookmarks = bookmarks;
    }
  },
  actions: {
    async fetchBookmarks({ commit, state }, { filter, pagination }) {
      const bookmarks = await repository.getBookmarks(
        state.user.id,
        filter,
        pagination
      );

      if (pagination) {
        state.bookmarks = [...state.bookmarks, ...bookmarks];
      } else {
        state.bookmarks = bookmarks;
      }

      state.bookmarksAllFetched = bookmarks.length === 0;
    }
  },
  modules: {}
});
