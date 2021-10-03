import { createApp } from 'vue'

import App from './App.vue'
import { router } from './router'
import { auth } from './firebaseApp'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faEdit, faSave, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faArrowLeft)
library.add(faEdit)
library.add(faSave)
library.add(faTrashAlt)

auth.onAuthStateChanged(user => {
  createApp(App)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
})
