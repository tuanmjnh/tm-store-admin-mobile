<script setup lang="ts">
import { storageLib } from 'tm-libs'
import { useAppStore, useAuthStore, useTypeStore, useGroupStore, useConnectsStore } from './store'
const appStore = useAppStore()
const authStore = useAuthStore()
const typeStore = useTypeStore()
const groupStore = useGroupStore()
const connectsStore = useConnectsStore()
onMounted(() => {
  if (authStore.accessToken) {
    // types
    const typeStoreAll = storageLib.get('typeStore.all')
    if (!typeStoreAll || !typeStoreAll.length) typeStore.getAll()
    // groups
    const groupStoreAll = storageLib.get('groupStore.all')
    if (!groupStoreAll || !groupStoreAll.length) groupStore.getAll()
    //Connects
    connectsStore.googleVerifyAccessToken()
  }
})
// console.log(window.matchMedia('(prefers-color-scheme: dark)').matches)
</script>
<template>
  <div class="app-wrapper">
    <van-config-provider :theme="appStore.darkMode ? 'dark' : 'light'">
      <router-view />
    </van-config-provider>
  </div>
</template>

<style></style>
