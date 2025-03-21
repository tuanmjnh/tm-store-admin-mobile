<script setup lang="ts">
import { useAuthStore } from '@/store'
const $router = useRouter()
const authStore = useAuthStore()
const isDialogLogout = ref(false)
const onLogout = () => {
  authStore.logout().then(() => {
    isDialogLogout.value = false
    $router.push('/login')
  })
}
</script>
<template>
  <van-cell-group>
    <van-cell :title="$t('profile.title')" is-link to="/profile/infomation" />
    <van-cell :title="$t('profile.security')" is-link to="/profile/security" />
    <van-cell :title="$t('navbar.logout')" is-link @click="isDialogLogout = true">
      <template #title>
        <span class="text-red-500">{{ $t('navbar.logout') }}</span>
      </template>
    </van-cell>
  </van-cell-group>
  <van-action-sheet v-model:show="isDialogLogout" :cancel-text="$t('global.cancel')" close-on-click-action
    :actions="[{ name: $t('navbar.logout'), color: '#f56c6c' }]" @select="onLogout">
  </van-action-sheet>
  <!-- <van-action-sheet v-model:show="isDialogLogout" :cancel-text="$t('global.cancel')" close-on-click-action>
    <button type="button" class="van-action-sheet__item" @click="onLogout">
      <span class="van-action-sheet__name">{{ $t('navbar.logout') }}</span>
    </button>
  </van-action-sheet> -->
</template>