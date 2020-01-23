import Vue from "vue";
import { auth } from "firebase/app";
import "./firebaseApp";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import App from "./App.vue";
import "./assets/variables.scss";
import "./assets/styles.scss";

Vue.config.productionTip = false;

auth().onAuthStateChanged(user => {
  if (!user) {
    auth().signInWithRedirect(new auth.GoogleAuthProvider());
  } else {
    store.commit("setUser", {
      id: user.uid,
      email: user.email,
      photoURL: user.photoURL
    });
    renderApp();
  }
});

function renderApp() {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}
