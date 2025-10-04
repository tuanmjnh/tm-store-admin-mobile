import { http } from '@src/plugins/http-axios'
import { IGoogleFile } from '@src/services/google/drive-gapi'

const constant = {
  type: null,
  parent: null,
  code: null,
  title: null,
  desc: null,
  level: null,
  content: null,
  url: null,
  images: null,
  quantity: null,
  position: null,
  tags: null,
  icon: 'spa',
  color: null,
  meta: null,
  startAt: null,
  endAt: null,
  order: 1,
  flag: 1,
  created: { at: null, by: null, ip: null }
}

const API_PATH = 'groups'
export const useGroupStore = defineStore('groupStore', {
  persist: true,
  state: (): {
    all: Models.IGroup[]
    items: Models.IGroup[]
    item: Models.IGroup,
    root: Models.IGroup
    // metaKeys: []
    // metaValues: []
  } => ({
    all: [],
    items: [],
    item: JSON.parse(JSON.stringify(constant)),
    root: {
      _id: null,
      key: null,
      code: null,
      parent: null,
      title: 'Root',//$t('group.root'),//'Root'
      desc: null,
      level: 0,
      content: null,
      url: null,
      image: null,
      images: null,
      quantity: null,
      position: null,
      tags: null,
      icon: 'spa',
      color: null,
      meta: null,
      time: null,
      sort: 0,
      flag: 1,
      created: { at: null, by: null, ip: null }
    }
  }),
  getters: {
    getByType: (state) => {
      return (key) => state.all.filter(x => x.key == key).sort((a, b) => { return a.sort - b.sort })
    }
  },
  actions: {
    async getAll(arg?: any): Promise<Common.IResponseItems> {
      try {
        const rs: Common.IResponseItems = await http.get(`/${API_PATH}/all`, { params: arg })
        this.all = rs.data.items.sort((a, b) => { return a.order - b.order }) as Models.IGroup[]
        return rs
      } catch (e) { throw e }
    },
    async getItems(arg?: any): Promise<Common.IResponseItems> {
      try {
        const rs: Common.IResponseItems = await http.get(`/${API_PATH}`, { params: arg })
        this.items = rs.data.items
        // this.rowsNumber = rs.rowsNumber
        return rs
      } catch (e) { throw e }
    },
    async getItem(arg?: any): Promise<Common.IResponseItem> {
      try {
        const rs: Common.IResponseItem = await http.get(`/${API_PATH}/${arg.id}`, { params: arg })
        this.item = rs.data
        return rs
      } catch (e) { throw e }
    },
    async create(arg?: any) {
      try {
        const rs: Common.IResponseItem = await http.post(`/${API_PATH}`, arg)
        if (rs.status) this.addItems(rs.data)
        return rs
      } catch (e) { throw e }
    },
    async update(arg?: any) {
      try {
        const rs: Common.IResponseItem = await http.put(`/${API_PATH}`, arg)
        if (rs.status) this.updateItems(rs.data)
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
    async addItems(arg: any, items?: Models.IGroup[]) {
      try {
        if (items) {
          if (Array.isArray(arg)) {
            this.items.concat(arg)
            this.all.concat(arg)
          }
          else {
            this.items.push(arg)
            this.all.push(arg)
          }
        } else {
          if (Array.isArray(arg)) {
            this.items.concat(arg)
            this.all.concat(arg)
          }
          else {
            this.items.push(arg)
            this.all.push(arg)
          }
        }
      } catch (e) { throw e }
    },
    async updateItems(arg: any, items?: Models.IGroup[]) {
      try {
        if (Array.isArray(arg)) {
          arg.forEach(e => {
            if (items) {
              const i = items.findIndex(x => x._id === e._id)
              if (i > -1) items.splice(i, 1, e)
            } else {
              let i = this.items.findIndex(x => x._id === e._id)
              if (i > -1) this.items.splice(i, 1, e)
              i = this.all.findIndex(x => x._id === e._id)
              if (i > -1) this.all.splice(i, 1, e)
            }
          })
        } else {
          let i = this.items.findIndex(x => x._id === arg._id)
          if (i > -1) this.items.splice(i, 1, arg)
          i = this.all.findIndex(x => x._id === arg._id)
          if (i > -1) this.all.splice(i, 1, arg)
        }
      } catch (e) { throw e }
    },
    async removeItems(arg: any, items?: Models.IGroup[]) {
      try {
        if (Array.isArray(arg)) {
          arg.forEach(e => {
            if (items) {
              let i = items.findIndex(x => x._id === e)
              if (i > -1) items.splice(i, 1)
            } else {
              let i = this.items.findIndex(x => x._id === e)
              if (i > -1) this.items.splice(i, 1)
              i = this.all.findIndex(x => x._id === e)
              if (i > -1) this.all.splice(i, 1)
            }
          })
        } else {
          if (items) {
            const i = items.findIndex(x => x._id === arg)
            if (i > -1) items.splice(i, 1)
          } else {
            let i = this.items.findIndex(x => x._id === arg)
            if (i > -1) this.items.splice(i, 1)
            i = this.all.findIndex(x => x._id === arg)
            if (i > -1) this.all.splice(i, 1)
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
