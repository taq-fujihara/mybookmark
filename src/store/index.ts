import Vue from "vue";
import Vuex from "vuex";
import Bookmark from "@/models/Bookmark";
import repository from "@/repository";

Vue.use(Vuex);

let unsubscribeTags: () => void;

const store = new Vuex.Store({
  state: {
    user: {
      id: "",
      email: "",
      photoURL: ""
    },
    bookmarks: new Array<Bookmark>(),
    bookmarksAllFetched: false,
    tags: new Array<string>()
  },
  mutations: {
    setUser(state, user) {
      state.user.id = user.id;
      state.user.email = user.email;
      state.user.photoURL = user.photoURL;

      if (unsubscribeTags) {
        unsubscribeTags();
      }

      if (!state.user.id) {
        return;
      }

      unsubscribeTags = repository.onTagsChange(user.id, 10, tags => {
        store.commit("setTags", tags);
      });
    },
    setBookmarks(state, bookmarks: Array<Bookmark>) {
      state.bookmarks = bookmarks;
    },
    setTags(state, tags: Array<string>) {
      state.tags = tags;
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
        commit("setBookmarks", [...state.bookmarks, ...bookmarks]);
      } else {
        commit("setBookmarks", bookmarks);
      }

      state.bookmarksAllFetched = bookmarks.length === 0;
    }
  },
  modules: {}
});

export default store;
