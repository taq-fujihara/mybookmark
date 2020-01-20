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
    auth()
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then(async result => {
        store.commit("setUser", { id: result!.user!.uid });
        renderApp();
      })
      .catch(e => {
        alert("Error!");
      });
  } else {
    store.commit("setUser", { id: user.uid, email: user.email });
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
