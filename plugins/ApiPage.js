import Vue from 'vue'

const ApiPage = {
  install () {
    if (Vue.__apipage_installed__) {
      return
    }
    Vue.__apipage_installed__ = true

    if (!Vue.prototype.hasOwnProperty('$getPage')) {
      Object.defineProperty(Vue.prototype, '$getPage', {
        get () {
          return this.$root.$options.$getPage
        }
      })
    }
  }
}

Vue.use(ApiPage)

// Return object like $axios plugin will have
function AxiosError (status, message) {
  return {
    statusCode: status,
    message: message
  }
}

// Call method on component from asyncData
function fetchPage ({ error, store, app }, { slug, cmsKey, menu, patchUrlPrefix }) {
  // Don't fetch if we already expect an error page to display
  if (app._nuxt.err) {
    return
  }

  // menuUrl
  let menuUrl = 'menus/top/' + slug
  // menu ops
  if (!(menu instanceof Object)) { menu = {} }
  let menuOrderQs = []
  if (menu.sortBy) { menuOrderQs.push('sortBy=' + menu.sortBy) }
  if (menu.order) { menuOrderQs.push('sortOrder=' + menu.order) }
  if (menuOrderQs.length > 0) {
    menuOrderQs = menuOrderQs.join('&')
    menuUrl += '?' + menuOrderQs
  }

  // component data
  const vmData = {
    slug: slug,
    cmsKey: cmsKey,
    sideMenuUrl: menuUrl
  }

  // All requests completed function
  const complete = (newData) => {
    store.commit('pages/initPage', {
      slug: slug,
      data: newData
    })
    return vmData
    /* Ensure we call back after the page has been initialised
    return new Promise((resolve) => {
      Vue.nextTick(() => {
        resolve(vmData)
      })
    }) */
  }

  // Do the request for the page from API
  return app.$axios.get(slug)
    .then((res) => {
      if (res.statusCode) {
        throw new AxiosError(res.statusCode, res.message)
      }
      if (typeof res.data !== 'object' || !res.data.id) {
        throw new AxiosError(500, 'API did not respond correctly (data not an object)')
      }

      // Response OK, set initial data
      let newData = res.data
      // Add patchUrl and setup CMS endpoint for ROLE_ADMIN
      if (store.getters.hasRole('ROLE_ADMIN')) {
        newData.patchUrl = store.getters.getApiUrl(patchUrlPrefix + '/' + res.data.id)
        store.commit('cms/initEndpoint', {
          endpoint: newData.patchUrl,
          initKey: cmsKey
        })
      }
      //  Set whether any further requests are now needed
      let loadSideMenu = newData.hasChildren
      let loadForm = newData.form
      if (!loadSideMenu && !loadForm) {
        return complete(newData)
      }
      // Setup extra requests
      let requests = []
      let loadPaths = {
        form: store.getters.getApiUrl('form/' + slug),
        sideMenu: store.getters.getApiUrl(vmData.sideMenuUrl)
      }
      if (loadForm) {
        requests.push(app.$axios.get(loadPaths.form))
      }
      if (loadSideMenu) {
        requests.push(app.$axios.get(loadPaths.sideMenu))
      }
      // Process sub-requests
      return Promise.all(requests)
        .then((allRes) => {
          // Loop sub-request results and set data
          for (const res of allRes) {
            switch (res.config.url) {
              case loadPaths.form:
                newData = Object.assign(newData, {
                  formData: Object.assign(
                    {
                      lastModified: res.headers['last-modified']
                    },
                    res.data
                  )
                })
                break
              case loadPaths.sideMenu:
                newData = Object.assign(newData, {
                  sideMenu: res.data
                })
                break
            }
          }
          // Setup data in store
          return complete(newData)
        })
        .catch((err) => {
          error({
            statusCode: err.response.status,
            message: 'The page\'s dependencies could not be loaded'
          })
        })
    })
    .catch((err) => {
      if (err.response) {
        error({
          statusCode: err.response.status,
          message: (err.response.status === 404 ? 'Page could not be found' : err.response.data.message)
        })
      } else {
        if (typeof err === 'string') {
          error({
            statusCode: 500,
            message: err
          })
        } else {
          error({
            statusCode: 500,
            message: 'An error occurred'
          })
        }
      }
    })
}

export default (ctx) => {
  const { app } = ctx
  const getPage = (payload) => {
    return fetchPage(ctx, payload)
  }
  // Make accessible using *.$getPage
  app.$getPage = getPage
}
