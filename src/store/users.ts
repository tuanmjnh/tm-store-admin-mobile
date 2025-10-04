import { http } from '@src/plugins/http-axios'
import { IGoogleFile } from '@src/services/google/drive-gapi'

const constant = {
  group: null,
  username: null,
  password: null,
  fullName: null,
  email: null,
  phone: null,
  personNumber: null,
  region: null,
  avatar: null,
  note: '',
  dateBirth: new Date(),
  gender: null,
  address: null,
  roles: [],
  verified: false,
  enable: true,
  lastLogin: null,
  lastChangePass: null,
  created: { at: null, by: null, ip: null }
}

const API_PATH = 'users'
export const useUserStore = defineStore('userStore', {
  persist: false,
  state: (): {
    items: Models.IUser[]
    item: Models.IUser
    // metaKeys: []
    // metaValues: []
  } => ({
    items: [],
    item: JSON.parse(JSON.stringify(constant)),
  }),
  getters: {
  },
  actions: {
    async getAll(arg?: any): Promise<Common.IResponseItems> {
      try {
        const rs: Common.IResponseItems = await http.get(`/${API_PATH}/all`, { params: arg })
        this.all = rs.data.items as Models.IUser[]
        return rs
      } catch (e) { throw e }
    },
    async getItems(arg?: any): Promise<Common.IResponseItems> {
      try {
        const rs: Common.IResponseItems = await http.get(`/${API_PATH}`, { params: arg })
        this.items = rs.data
        // this.rowsNumber = rs.rowsNumber
        return rs
      } catch (e) { throw e }
    },
    async getItem(arg?: any): Promise<Common.IResponseItems> {
      try {
        const rs: Common.IResponseItems = await http.get(`/${API_PATH}/${arg.id}`, { params: arg })
        this.item = rs.data
        return rs
      } catch (e) { throw e }
    },
    async create(arg?: any) {
      try {
        const rs: Common.IResponseItem = await http.post(`/${API_PATH}`, arg)
        return rs
      } catch (e) { throw e }
    },
    async update(arg?: any) {
      try {
        const rs: Common.IResponseItem = await http.put(`/${API_PATH}`, arg)
        return rs
      } catch (e) { throw e }
    },
    async resetPassword(arg?: any) {
      try {
        const rs: Common.IResponseItem = await http.put(`/${API_PATH}/reset-password`, arg)
        return rs
      } catch (e) { throw e }
    },
    async changePassword(arg?: any) {
      try {
        const rs: Common.IResponseItem = await http.put(`/${API_PATH}/change-password`, arg)
        return rs
      } catch (e) { throw e }
    },
    async updateFlag(arg?: any) {
      try {
        const rs: Common.IResponseArray = await http.patch(`/${API_PATH}`, arg)
        return rs
      } catch (e) { throw e }
    },
    async setItem(arg?: any) {
      this.item = arg ? { ...arg } : JSON.parse(JSON.stringify(constant))
    },
    async addItems(arg: any, items?: Models.IUser[]) {
      try {
        if (items) {
          if (Array.isArray(arg)) this.items.concat(arg)
          else this.items.push(arg)
        } else {
          if (Array.isArray(arg)) this.items.concat(arg)
          else this.items.push(arg)
        }
      } catch (e) { throw e }
    },
    async updateItems(arg: any, items?: Models.IUser[]) {
      try {
        if (Array.isArray(arg)) {
          arg.forEach(e => {
            if (items) {
              const i = items.findIndex(x => x._id === e._id)
              if (i > -1) items.splice(i, 1, e)
            } else {
              const i = this.items.findIndex(x => x._id === e._id)
              if (i > -1) this.items.splice(i, 1, e)
            }
          })
        } else {
          const i = this.items.findIndex(x => x._id === arg._id)
          if (i > -1) this.items.splice(i, 1, arg)
        }
      } catch (e) { throw e }
    },
    async removeItems(arg: any, items?: Models.IUser[]) {
      try {
        if (Array.isArray(arg)) {
          arg.forEach(e => {
            if (items) {
              const i = items.findIndex(x => x._id === e)
              if (i > -1) items.splice(i, 1)
            } else {
              const i = this.items.findIndex(x => x._id === e)
              if (i > -1) this.items.splice(i, 1)
            }
          })
        } else {
          if (items) {
            const i = items.findIndex(x => x._id === arg)
            if (i > -1) items.splice(i, 1)
          } else {
            const i = this.items.findIndex(x => x._id === arg)
            if (i > -1) this.items.splice(i, 1)
          }
        }
      } catch (e) { throw e }
    },
    // easily reset state using `$reset`
    clear() {
      this.$reset()
    }
  }
})
