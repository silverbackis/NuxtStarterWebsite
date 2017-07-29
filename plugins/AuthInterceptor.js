export default ({ app }) => {
  if (process.browser) {
    const jwtDecode = require('jwt-decode')

    app.$axios.interceptors.response.use(
      null,
      (error) => {
        if (error.statusCode === 403 && error.response && !error.response.config.isRetry) {
          // try to refresh the token
          return app.$axios.post(
            '/refresh_token',
            {
              _action: this.$store.getters.getApiUrl('refresh_token')
            },
            {
              baseURL: null
            }
          )
            .then((res) => {
              // We were successful with our refreshing - so time to retry the request
              app.$store.commit('setAuthUser', jwtDecode(res.data.token))
              error.response.config.isRetry = true
              return app.$axios(error.response.config)
            })
            .catch((err) => {
              app.$store.commit('setAuthUser', null)
              if (err.statusCode === 500) {
                return Promise.reject(err)
              }
              // Unsuccessful responses from our middleware will result in cookies being unset anyway
              // Some of these requests can be carried out without a token so we should retry anyway
              error.response.config.isRetry = true
              return app.$axios(error.response.config)
            })
        }
        return Promise.reject(error)
      }
    )
  }
}
