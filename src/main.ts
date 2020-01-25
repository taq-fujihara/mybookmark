import Vue, { VueConstructor } from "vue";
import { auth } from "firebase/app";
import "./firebaseApp";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import App from "./App.vue";
import "./assets/variables.scss";
import "./assets/styles.scss";

Vue.config.productionTip = false;

let app: Vue;

auth().onAuthStateChanged(user => {
  if (!user) {
    store.commit("setUser", {
      id: "",
      email: "",
      photoURL: ""
    });
  } else {
    store.commit("setUser", {
      id: user.uid,
      email: user.email,
      photoURL: user.photoURL
    });
  }
  renderApp(App);
});

function renderApp(component: VueConstructor<Vue>): void {
  if (app) {
    return;
  }

  app = new Vue({
    router,
    store,
    render: h => h(component)
  }).$mount("#app");
}
