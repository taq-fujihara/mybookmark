<template>
  <div id="app">
    <div id="auth-ui" ref="authUi"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { auth } from "@/firebaseApp";
import * as firebase from "firebase";
import * as firebaseui from "firebaseui";

const ui = new firebaseui.auth.AuthUI(auth);

@Component
export default class Auth extends Vue {
  mounted() {
    ui.start(this.$refs.authUi as Element, {
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    });
  }
}
</script>
