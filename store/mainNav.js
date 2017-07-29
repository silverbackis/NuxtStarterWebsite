export const state = () => ({
  loaded: false,
  menu: [],
  nextLoadingEl: null,
  loadingEl: null,
  error: false
})

export const mutations = {
  setMenu (state, data) {
    state.loaded = true
    state.menu = data
  },
  setLoadingEl (state, el) {
    state.nextLoadingEl = el
    if (el === null) {
      state.loadingEl = null
    }
  },
  setLoading (state) {
    state.loadingEl = state.nextLoadingEl
  },
  setError (state, error) {
    console.log('set error', error)
    state.error = error
  }
}

export const getters = {
  getError: (state) => () => {
    return state.error
  },
  loadingEl: (state) => {
    return state.loadingEl
  }
}

export const actions = {
  async initNavMenu ({ commit }, { $axios }) {
    let data = []
    try {
      let res = await $axios.get('menus/top?depth=1')
      data = res.data
      commit('setMenu', data)
    } catch (err) {
      commit('setError', { statusCode: err.statusCode, message: err.message || 'Failed to load menu' })
    }
  }
}
