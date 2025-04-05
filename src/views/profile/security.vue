<script setup lang="ts">
</script>
<template>
  <van-cell-group>
    <van-cell :title="$t('user.changePassword')" is-link to="/profile/security/change-password" />
    <van-cell title="Authenticator 2FA" is-link />
  </van-cell-group>
  <tab-bar-view>
    <template #item>
      <van-tabbar-item />
      <van-tabbar-item />
    </template>
  </tab-bar-view>
</template>