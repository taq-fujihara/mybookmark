import Vue, { VueConstructor } from "vue";
import { auth } from "firebase/app";
import "./firebaseApp";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import App from "./App.vue";
import Auth from "./views/Auth.vue";
import "./assets/variables.scss";
import "./assets/styles.scss";

Vue.config.productionTip = false;

let app: Vue;

auth().onAuthStateChanged(user => {
  if (!user) {
    renderApp(Auth);
  } else {
    store.commit("setUser", {
      id: user.uid,
      email: user.email,
      photoURL: user.photoURL
    });
    renderApp(App);
  }
});

function renderApp(component: VueConstructor<Vue>): void {
  if (app) {
    app.$destroy();
  }
  app = new Vue({
    router,
    store,
    render: h => h(component)
  }).$mount("#app");
}
