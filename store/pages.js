import Vue from 'vue'

export const state = () => ({
  pages: {}
})

export const getters = {
  getPage: (state) => (slug) => {
    return state.pages[slug] || {}
  }
}

export const mutations = {
  initPage (state, { slug, data }) {
    Vue.set(state.pages, slug, Object.assign({
      body: '',
      form: null,
      formData: null,
      hasChildren: false,
      header: '',
      id: '',
      label: '',
      name: '',
      sideMenu: [],
      subLabel: '',
      subHeader: null,
      patchUrl: '',
      date: null,
      lastUpdated: null,
      metaDescription: null
    }, data))
  },
  setSideMenu (state, { slug, sideMenu }) {
    if (sideMenu === '') {
      state.pages[slug].hasChildren = false
    }
    Vue.set(state.pages[slug], 'sideMenu', sideMenu)
  },
  destroyPage (state, slug) {
    Vue.delete(state.pages, slug)
  }
}

export const actions = {}
