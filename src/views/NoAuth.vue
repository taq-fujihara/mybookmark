<script setup lang="ts">
import { onMounted } from 'vue'

import { auth } from '../firebaseApp'
// import { auth as firebaseuiAuth } from 'firebaseui'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

onMounted(() => {
  console.log('Mount!!!!');
  const ui = new firebaseui.auth.AuthUI(auth)
})
</script>

<template>
  <div>no auth</div>
</template>
