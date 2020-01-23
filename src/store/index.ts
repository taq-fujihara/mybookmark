import Vue from "vue";
import Vuex, { Store } from "vuex";
import Bookmark from "@/models/Bookmark";
import repository from "@/repository";

Vue.use(Vuex);

let unsubscribeRecentlyCreatedTag: () => void;

const store = new Vuex.Store({
  state: {
    user: {
      id: "",
      email: "",
      photoURL: ""
    },
    bookmarks: new Array<Bookmark>(),
    bookmarksAllFetched: false,
    tags: {
      recentlyCreated: new Array<string>()
    }
  },
  mutations: {
    setUser(state, user) {
      state.user.id = user.id;
      state.user.email = user.email;
      state.user.photoURL = user.photoURL;

      if (unsubscribeRecentlyCreatedTag) {
        unsubscribeRecentlyCreatedTag();
      }

      unsubscribeRecentlyCreatedTag = repository.onRecentlyAddTagChange(
        user.id,
        11,
        tags => {
          store.commit("setRecentlyCreatedTags", tags);
        }
      );
    },
    setBookmarks(state, bookmarks: Array<Bookmark>) {
      state.bookmarks = bookmarks;
    },
    setRecentlyCreatedTags(state, tags: Array<string>) {
      state.tags.recentlyCreated = tags;
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

export default store;
