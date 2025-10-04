import { defineStore } from 'pinia'
import { http } from '@src/plugins/http-axios'
import { router } from '@src/router'

interface IAuthState {
  token: string | null
  user: Models.IUser | null
}

interface ILoginResponse {
  token: string
  user: Models.IUser
}

// interface IRegisterResponse {
//   user: Models.IUser
// }

const API_PATH = '/auth'

export const useAuthStore = defineStore('authStore', {
  persist: true,
  state: (): IAuthState => ({
    token: null,
    user: null,
  }),
  getters: {
    isLogin: (state) => Boolean(state.token),
  },
  actions: {
    async login(payload: { username: string; password: string }) {
      try {
        const res = await http.post<ILoginResponse>(API_PATH, payload)
        this.token = res.token
        this.user = res.user

        const { query } = unref(router.currentRoute)
        router.push({ path: (query as any)?.redirect || '/' })

        return true
      } catch (error: any) {
        console.error('Login failed:', error.message || error)
        this.clearAuth()
        return false
      }
    },
    // async register(payload: {
    //   username: string
    //   password: string
    //   name: string
    //   email: string
    //   group?: string
    // }) {
    //   try {
    //     const res = await http.put<IRegisterResponse>(API_PATH, payload)
    //     return res.user
    //   } catch (error: any) {
    //     console.error('Register failed:', error.message || error)
    //     return null
    //   }
    // },
    async fetchMe() {
      try {
        const res = await http.get<{ user: Models.IUser }>(`${API_PATH}/me`)
        if (res?.user) {
          this.user = res.user
          return res.user
        }
      } catch (error) {
        console.error('Fetch me failed:', error)
        this.clearAuth()
      }
      return null
    },
    async logout() {
      this.clearAuth()
      const route = unref(router.currentRoute)

      if (route.meta.requiresAuth) {
        router.push({
          name: 'login',
          query: { redirect: route.fullPath },
        })
      }
    },
    clearAuth() {
      this.token = null
      this.user = null
    },
    clear() { // easily reset state using `$reset`
      this.$reset()
    }
  },
})
