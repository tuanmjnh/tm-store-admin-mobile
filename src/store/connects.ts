import { http } from '@src/plugins/http-axios'
import { GoogleTokenInfo } from '@src/services/google/oauth2'

export interface IModelConnectProfile {
  email?: string
  email_verified?: boolean
  name?: string
  picture?: string
  given_name?: string
  family_name?: string
  iat?: number
  exp?: number
}

const API_PATH = 'connects'
export const useConnectsStore = defineStore('connectsStore', {
  persist: true,
  state: (): {
    google: Models.IConnect
    facebook: Models.IConnect
    tiktok: Models.IConnect
  } => ({
    google: { key: 'google', title: 'Google', profile: {}, sort: 1, flag: 1 },
    facebook: { key: 'facebook', title: 'Facebook', profile: {}, sort: 2, flag: 1 },
    tiktok: { key: 'tiktok', title: 'Tiktok', profile: {}, sort: 3, flag: 1 },
  }),
  getters: {
  },
  actions: {
    async googleVerifyAccessToken(arg?: any): Promise<boolean> {
      try {
        const rs = await GoogleTokenInfo(this.google.access_token)
        if (rs.exp) return true
        else {
          const credential = await this.googleGetAuth()
          return credential.status
        }
      } catch (e) { throw e }
    },
    async googleGetAuth(arg?: any): Promise<Common.IResponseItems> {
      try {
        const rs: Common.IResponseItems = await http.get(`/${API_PATH}/google`, { params: arg })
        this.google = rs.data.items
        return rs
      } catch (e) { throw e }
    },
    async googleAuthByCode(arg?: any): Promise<Common.IResponseItems> {
      try {
        const rs: Common.IResponseItems = await http.post(`/${API_PATH}/google`, arg)
        this.google = rs.data
        return rs
      } catch (e) { throw e }
    },
    async googleRemoveAuth(arg?: any): Promise<Common.IResponseItems> {
      try {
        const rs: Common.IResponseItems = await http.patch(`/${API_PATH}/google`, arg)
        if (rs.status) {
          this.google.access_token = null
          this.google.profile = null
        }
        return rs
      } catch (e) { throw e }
    },
    async googleSetClientID(arg?: any): Promise<Common.IResponseItems> {
      try {
        const rs: Common.IResponseItems = await http.put(`/${API_PATH}/google`, arg)
        this.google = rs.data
        return rs
      } catch (e) { throw e }
    },
    async googleRemoveClientID(arg?: any): Promise<Common.IResponseItems> {
      try {
        const rs: Common.IResponseItems = await http.delete(`/${API_PATH}/google`, arg)
        if (rs.status) {
          this.google.access_token = null
          this.google.profile = null
        }
        return rs
      } catch (e) { throw e }
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
