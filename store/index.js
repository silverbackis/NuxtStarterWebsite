import jwtDecode from 'jwt-decode'
import CookieUtils from '~/server/api/cookies'
export const state = () => ({
  apiUrl: null,
  authUser: null,
  authInterceptorAdded: false
})

export const mutations = {
  setApiUrl (state, url) {
    state.apiUrl = url
  },
  setAuthUser (state, user) {
    state.authUser = user
  },
  setAuthInterceptorAdded (state, bool) {
    state.authInterceptorAdded = bool
  }
}

export const getters = {
  getApiUrl: (state) => (path) => {
    if (path.indexOf('/') === 0) {
      path = path.substring(1)
    }
    return state.apiUrl + path
  },
  getApiImageUrl: (state, getters) => (filter, path) => {
    return getters.getApiUrl('media/cache/resolve/' + filter + '/' + path)
  },
  getApiPath: (state) => (url) => {
    return url.replace(state.apiUrl, '')
  },
  getAuthUser: (state) => () => {
    return state.authUser
  },
  hasRole: (state) => (role) => {
    return !state.authUser ? false : (state.authUser.roles ? state.authUser.roles.indexOf(role) !== -1 : false)
  },
  getAuthInterceptorAdded: (state) => {
    return state.authInterceptorAdded
  }
}

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { req, app, res }) {
    if (req.session && req.session.authUser) {
      CookieUtils.setJwtCookie(res, req.session.authUser)
      commit('setAuthUser', jwtDecode(req.session.authUser))
    }
    commit('setApiUrl', app.$axios.defaults.baseURL)
    // Also need to initialise other modules - nuxtServerInit only called from index.js
    await dispatch('mainNav/initNavMenu', { $axios: app.$axios })
  }
}
