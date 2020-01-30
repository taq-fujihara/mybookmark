<template>
  <div id="app">
    <NavBar @logout="signOut" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Watch } from "vue-property-decorator";
import { auth } from "@/firebaseApp";
import NavBar from "@/components/NavBar.vue";

@Component({
  components: { NavBar }
})
export default class App extends Vue {
  get currentRoute(): string {
    if (!this.$route.name) {
      return "";
    }
    return this.$route.name;
  }

  async signOut() {
    await auth.signOut();
  }

  @Watch("$store.state.user.id")
  onAuthStateChanged(userId: string) {
    if (userId) {
      this.$router.push("/");
    } else {
      this.$router.push("/auth");
    }
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

  padding: var(--spacing-large);
}
</style>
