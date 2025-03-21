import { http } from '@/plugins/http-axios'
import { router } from '@/router'
// import { local } from '@/utils/storage'
import { IUser } from './interfaces/user'
import { storageLib } from 'tm-libs'

interface IModel {
  userInfo: IUser | null
  accessToken: string,
  routes: Array<string>
}
const API_PATH = 'auth'
export const useAuthStore = defineStore('authStore', {
  // persist: true,
  state: (): IModel => ({
    userInfo: storageLib.get('user-info'),
    accessToken: storageLib.get('access-token') || '',
    routes: storageLib.get('routes') || []
  }),
  getters: {
    /** Are you logged in? */
    isLogin(state) {
      return Boolean(state.accessToken)
    },
  },
  actions: {
    async verify(arg: any) {
      let rs
      try {
        if (arg) rs = await http.axiosInstance.post(`/${API_PATH}`, arg)
        else rs = await http.axiosInstance.get(`/${API_PATH}`, { params: arg })
        if (rs) {
          this.handleLoginInfo(rs)
        } else {
          this.clearAuthStorage()
          this.resetRouter()
        }
        return rs
      } catch (e) {
        // console.log(e)
        return rs
      }
    },
    /* Log in and out, reset user information, etc. */
    async logout() {
      const route = unref(router.currentRoute)
      // Clear local cache
      this.clearAuthStorage()
      // Clear route, menu and other data
      // const routeStore = useRouteStore()
      // routeStore.resetRouteStore()
      // Reset current repository
      this.$reset()
      // Redirect to login page
      if (route.meta.requiresAuth) {
        router.push({
          name: 'login',
          query: {
            redirect: route.fullPath,
          },
        })
      }
    },
    /* Processing the data returned by login */
    async handleLoginInfo(val) {
      // Save token and userInfo
      if (val.data) {
        this.userInfo = val.data
        storageLib.set('user-info', val.data)
      }
      if (val.accessToken) {
        this.accessToken = val.accessToken
        storageLib.set('access-token', val.accessToken)
      }
      if (val.routes) {
        this.routes = val.routes
        storageLib.set('routes', val.routes)
      }
      if (val.refreshToken) {
        storageLib.set('refresh-token', val.refreshToken)
      }
      // Adding Routes and Menus
      // const routeStore = useRouteStore()
      // await routeStore.initAuthRoute()

      // Redirect jump
      const route = unref(router.currentRoute)
      const query = route.query as { redirect: string }
      router.push({
        path: query.redirect || '/',
      })
    },
    clearAuthStorage() {
      storageLib.remove('access-token')
      storageLib.remove('refresh-token')
      storageLib.remove('user-info')
      storageLib.remove('routes')
      this.accessToken = null
      this.userInfo = null
      this.routes = []

    },
    resetRoutes() {
      if (router.hasRoute('root'))
        router.removeRoute('root')
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
