import cookies from '~/server/api/cookies'

const reqHeaders = (cookies) => {
  return {
    'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
    'Cookie': 'PHPSESSID=' + cookies['PHPSESSID']
  }
}

export default function ({isServer, store, error, app, res, req, redirect, route}) {
  if (isServer) {
    // Server-side interceptor - post directly to the API for refresh token
    return app.$axios.get(store.getters.getApiUrl(''))
      .then((axiosRes) => {
        cookies.setCookies(res, axiosRes)

        // Check if main Navigation loaded and display error if it didn't
        let menuError = store.getters['mainNav/getError']()
        if (menuError) {
          error(menuError)
        }
      })
      .catch((err) => {
        if (err.statusCode === 403) {
          let session = req.session
          if (!session.refreshToken) {
            cookies.clearJwtCookie(res)
            res.status(400).json({ message: 'Invalid session - refresh_token not available' })
            redirect(route.fullPath)
          } else {
            return app.$axios.post(
              store.getters.getApiUrl('/refresh_token'),
              {
                refresh_token: session.refreshToken
              },
              {
                headers: reqHeaders(req.cookies)
              })
              .then((refreshRes) => {
                session.authUser = refreshRes.data.token
                session.refreshToken = refreshRes.data.refresh_token
                cookies.setJwtCookie(res, session.authUser)
                redirect(route.fullPath)
              })
              .catch((err) => {
                if (!err.response) {
                  cookies.clearJwtCookie(res)
                  res.status(500).json({ success: false, message: err.message })
                } else {
                  cookies.clearJwtCookie(res)
                  res.status(500).json({ success: false, message: 'Refresh token rejected', error: (err.response.data.error && err.response.data.error.exception) ? err.response.data.error.exception[0].message : err.response.data.message })
                }
                redirect(route.fullPath)
              })
          }
        } else {
          let err = 'API / Database May Be Down<br /><b>Please try again later</b>'
          error({ statusCode: 500, message: err })
          console.warn(err)
        }
      })
  }
}
