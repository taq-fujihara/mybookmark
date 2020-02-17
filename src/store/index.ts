import Vue from "vue";
import Vuex from "vuex";
import Bookmark from "@/models/Bookmark";
import Repository from "@/repository";

Vue.use(Vuex);

const DEFAULT_VISIBLE_TAGS_MAX = 20;

let unsubscribeTags: () => void;

export default new Vuex.Store({
  state: {
    app: {
      version: process.env.VUE_APP_VERSION,
      repository: {
        url: process.env.VUE_APP_REPOSITORY_URL
      }
    },
    user: {
      id: "",
      email: "",
      photoURL: ""
    },
    bookmarks: new Array<Bookmark>(),
    bookmarksAllFetched: false,
    tags: {
      sort: {
        by: "createdAt",
        order: "desc" as "asc" | "desc"
      },
      list: new Array<string>(),
      more: false
    }
  },
  mutations: {
    setUser(state, user): void {
      state.user.id = user.id;
      state.user.email = user.email;
      state.user.photoURL = user.photoURL;
    },
    setBookmarks(state, bookmarks: Array<Bookmark>): void {
      state.bookmarks = bookmarks;
    }
  },
  actions: {
    async fetchBookmarks({ commit, state }, { filter, pagination }) {
      const bookmarks = await Repository.getBookmarks(
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
    loadTags({ state }, { by = "createdAt", order = "desc" }) {
      if (unsubscribeTags) {
        unsubscribeTags();
      }
      unsubscribeTags = Repository.onTagsChange(
        state.user.id,
        { by, order },
        DEFAULT_VISIBLE_TAGS_MAX + 1,
        tags => {
          state.tags.sort.by = by;
          state.tags.sort.order = order;
          state.tags.list = tags.slice(0, DEFAULT_VISIBLE_TAGS_MAX);
          state.tags.more = tags.length > DEFAULT_VISIBLE_TAGS_MAX;
        }
      );
    },
    loadAllTags({ state }) {
      if (unsubscribeTags) {
        unsubscribeTags();
      }
      // ソートは現在の選択を引き継ぐ
      unsubscribeTags = Repository.onTagsChange(
        state.user.id,
        { by: state.tags.sort.by, order: state.tags.sort.order },
        0,
        tags => {
          state.tags.list = tags;
          state.tags.more = false;
        }
      );
    }
  },
  modules: {}
});
