<script setup lang="ts">
import { useUserStore, useAuthStore } from '@/store'
import { $t } from '@/i18n'
import { showNotify } from 'vant'
import { showDialog } from 'vant'
const userStore = useUserStore()
const authStore = useAuthStore()
const $router = useRouter()
const isLoading = ref(false)
const isPassword = ref({
  old: true,
  new: true,
  re: true,
})
const formDefault = {
  _id: authStore.userInfo._id,
  oldPassword: '',
  newPassword: '',
  rePassword: '',
}
const form = ref({ ...{}, ...formDefault })
const onSubmit = async () => {
  isLoading.value = true
  try {
    const rs = await userStore.changePassword(form.value)
    if (rs.data) {//showNotify({ type: 'success', message: $t('success.update') })
      form.value = formDefault
      showDialog({ confirmButtonText: $t('global.confirm'), message: $t('success.update') }).then(() => {
        form.value = formDefault
        authStore.logout()
        $router.push('/login')
      })
    }
  } catch (error) {
    if (error.data && error.data.message) showNotify({ type: 'danger', message: $t(`error.${error.data.message}`) })
    else showNotify({ type: 'danger', message: $t(`http.${error.status}`) })
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <van-form>
    <van-cell-group inset>
      <van-field v-model="form.oldPassword" name="oldPassword" :label="$t('user.oldPassword')"
        :type="isPassword.old ? 'password' : 'text'" :rules="[
          { required: true, message: $t('error.required') },
          { validator: (v) => v.length > 5, message: $t('user.msgPasswordLength', { min: 5 }) }
        ]">
        <template #right-icon>
          <van-icon v-if="isPassword.old" name="closed-eye" @click="isPassword.old = false" />
          <van-icon v-else name="eye-o" @click="isPassword.old = true" />
        </template>
      </van-field>
      <van-field v-model="form.newPassword" name="Password" :label="$t('user.newPassword')"
        :type="isPassword.new ? 'password' : 'text'" :rules="[
          { required: true, message: $t('error.required') },
          { validator: (v) => v.length > 5, message: $t('user.msgPasswordLength', { min: 5 }) },
          { validator: (v) => v != form.oldPassword, message: $t('user.msgNewPassword') }
        ]">
        <template #right-icon>
          <van-icon v-if="isPassword.new" name="closed-eye" @click="isPassword.new = false" />
          <van-icon v-else name="eye-o" @click="isPassword.new = true" />
        </template>
      </van-field>
      <van-field v-model="form.rePassword" name="Password" :label="$t('user.rePassword')"
        :type="isPassword.re ? 'password' : 'text'" :rules="[
          { required: true, message: $t('error.required') },
          { validator: (v) => v.length > 5, message: $t('user.msgPasswordLength', { min: 5 }) },
          { validator: (v) => v == form.newPassword, message: $t('user.msgNewRePassword') }
        ]">
        <template #right-icon>
          <van-icon v-if="isPassword.re" name="closed-eye" @click="isPassword.re = false" />
          <van-icon v-else name="eye-o" @click="isPassword.re = true" />
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" @click="onSubmit" :loading="isLoading">
        {{ $t('user.changePassword') }}
      </van-button>
    </div>
  </van-form>
  <tab-bar-view>
    <template #item>
      <van-tabbar-item />
      <van-tabbar-item />
    </template>
  </tab-bar-view>
</template>