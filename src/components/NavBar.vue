<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item">
        <div class="logo">
          <img src="../assets/logo.png" />
          <span class="logo__app-name">Bookmarks</span>
        </div>
        <div class="logo">
          <figure class="image is-24x24">
            <img class="is-rounded" :src="$store.state.user.photoURL" />
          </figure>
        </div>
      </div>
      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': menuOpen }">
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button">
              Log out
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
  menuOpen = false;
}
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  &__app-name {
    color: #78909c;
    font-weight: bold;
    transform: translateX(-20%);
  }
}
</style>
