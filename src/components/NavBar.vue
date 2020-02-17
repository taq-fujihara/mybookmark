<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item">
        <figure class="image is-24x24">
          <img class="is-rounded" :src="$store.state.user.photoURL" />
        </figure>
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
      <div class="navbar-start">
        <a class="navbar-item" @click="movePage('bookmarks')">
          <i class="fas fa-bookmark"></i>
          Bookmarks
        </a>
        <a class="navbar-item" @click="movePage('tags')">
          <i class="fas fa-tag"></i>
          Tags
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            More
          </a>
          <div class="navbar-dropdown">
            <a
              class="navbar-item icon-left"
              :href="$store.state.app.repository.url"
              target="_blank"
            >
              <i class="fab fa-github"></i>
              <span>About</span>
            </a>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button" @click="$emit('logout')">
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

  movePage(to: string) {
    if (this.$route.name !== to) {
      this.$router.push("/" + to);
      this.menuOpen = false;
    }
  }
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

.navbar-item {
  i {
    margin-right: var(--spacing-small);
  }
}
</style>
