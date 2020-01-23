<template>
  <div id="app">
    <div class="buttons">
      <a class="button" @click="signOut">
        Log out
      </a>
      <span>{{ $store.state.user.email }}</span>
    </div>
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': currentRoute === 'bookmarks' }">
          <router-link to="/bookmarks">
            <span class="icon is-small"
              ><i class="fas fa-home" aria-hidden="true"></i
            ></span>
            <span>
              Home
            </span>
          </router-link>
        </li>
        <li :class="{ 'is-active': currentRoute === 'edit' }">
          <router-link to="/bookmarks/edit">
            <span class="icon is-small"
              ><i class="fas fa-plus-circle" aria-hidden="true"></i
            ></span>
            <span>
              Add / Edit
            </span>
          </router-link>
        </li>
      </ul>
    </div>

    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import repository from "@/repository";
import { auth } from "@/firebaseApp";

@Component
export default class App extends Vue {
  @Provide()
  repository = repository;

  get currentRoute(): String {
    if (!this.$route.name) {
      return "";
    }
    return this.$route.name;
  }

  async signOut() {
    await auth.signOut();
  }
}
</script>

<style lang="scss">
@import "../node_modules/bulma/bulma.sass";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  padding: 32px;
}
</style>
