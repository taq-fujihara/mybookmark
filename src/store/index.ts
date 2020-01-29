import Vue from "vue";
import Vuex from "vuex";
import Bookmark from "@/models/Bookmark";
import repository from "@/repository";

Vue.use(Vuex);

let unsubscribeTags: () => void;

export default new Vuex.Store({
  state: {
    user: {
      id: "",
      email: "",
      photoURL: ""
    },
    bookmarks: new Array<Bookmark>(),
    bookmarksAllFetched: false,
    tags: {
      list: new Array<string>(),
      more: false
    }
  },
  mutations: {
    setUser(state, user): void {
      state.user.id = user.id;
      state.user.email = user.email;
      state.user.photoURL = user.photoURL;

      if (unsubscribeTags) {
        unsubscribeTags();
      }

      if (!state.user.id) {
        return;
      }

      unsubscribeTags = repository.onTagsChange(user.id, 11, tags => {
        state.tags.list = tags.slice(0, 10);
        state.tags.more = tags.length > 10;
      });
    },
    setBookmarks(state, bookmarks: Array<Bookmark>): void {
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
        commit("setBookmarks", [...state.bookmarks, ...bookmarks]);
      } else {
        commit("setBookmarks", bookmarks);
      }

      state.bookmarksAllFetched = bookmarks.length === 0;
    },
    loadAllTags({ state }) {
      if (unsubscribeTags) {
        unsubscribeTags();
      }
      unsubscribeTags = repository.onTagsChange(state.user.id, 100, tags => {
        state.tags.list = tags;
        state.tags.more = false;
      });
    }
  },
  modules: {}
});
