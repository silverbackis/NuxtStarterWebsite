import { mapGetters } from 'vuex'
import Vue from 'vue'

const AxiosError = function (status, message) {
  return {
    response: {
      status: status,
      data: {
        message: message
      }
    }
  }
}

export default {
  mixins: {
    data () {
      return {
        slug: null,
        cmsKey: null
      }
    },
    head () {
      let hd = {
        title: this.page.header,
        meta: [
          { hid: 'description', name: 'description', content: this.page.realMetaDescription }
        ]
      }
      if (this.titleTemplate) {
        hd.titleTemplate = this.titleTemplate
      }
      return hd
    },
    computed: {
      ...mapGetters({
        isModifiedGetter: 'cms/isModified',
        storePage: 'pages/getPage'
      }),
      isModified () {
        return this.isModifiedGetter(this.cmsKey)
      },
      page () {
        return this.storePage(this.slug)
      }
    },
    beforeDestroy () {
      this.$store.commit('pages/destroyPage', this.slug)
    },
    methods: {
      reloadSideMenu () {
        if (this.slug !== '' && this.page.hasChildren) {
          this.$axios.get(this.$store.getters.getApiUrl(this.sideMenuUrl))
            .then((res) => {
              this.$store.commit('pages/setSideMenu', {
                slug: this.slug,
                sideMenu: res.data
              })
            })
        }
      },
      checkSaved (to, from, next) {
        // console.log('this.isModified', this.isModified, this.cmsKey)
        if (!this.isModified) {
          return next(true)
        }
        alert('uh oh, content has changed, it will not be saved!')
        return next(false)
      }
    }
    /**
     * Not working properly
     */
    /* beforeRouteUpdate (to, from, next) {
      return this.checkSaved(to, from, next)
    },
    beforeRouteLeave (to, from, next) {
      return this.checkSaved(to, from, next)
    } */
  },
  getPage ({ error, store, app }, { slug, patchUrlPrefix, cmsKey, menuSortBy, menuSortOrder }) {
    if (app._nuxt.err) {
      return
    }
    // Work out the URL to request a menu from fr the page
    let menuOrderParams = []
    if (menuSortBy) {
      menuOrderParams.push('sortBy=' + menuSortBy)
    }
    if (menuSortOrder) {
      menuOrderParams.push('sortOrder=' + menuSortOrder)
    }
    let menuOrderParamsStr = menuOrderParams.join('&')
    let menuUrl = 'menus/top/' + slug
    if (menuOrderParamsStr !== '') {
      menuUrl += '?' + menuOrderParamsStr
    }
    // Needed locally - will be returned and merged with data for component
    const localData = {
      slug: slug,
      cmsKey: cmsKey,
      sideMenuUrl: menuUrl
    }
    // Called when we have all the data (newData is populated)
    const complete = (newData) => {
      store.commit('pages/initPage', {
        slug: slug,
        data: newData
      })
      // Ensure we call back after the page has been initialised
      return new Promise((resolve) => {
        Vue.nextTick(() => {
          resolve(localData)
        })
      })
    }
    return app.$axios.get(slug)
      .then((res) => {
        if (res.statusCode) {
          throw new AxiosError(res.statusCode, res.message)
        }
        if (typeof res.data !== 'object' || !res.data.id) {
          throw new AxiosError(404, '')
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
          sideMenu: store.getters.getApiUrl(localData.sideMenuUrl)
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
                      {},
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
}
