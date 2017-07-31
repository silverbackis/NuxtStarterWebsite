import { mapGetters, mapMutations } from 'vuex'

export default {
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
      storePage: 'pages/getPage',
      hasRole: 'hasRole'
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
    ...mapMutations({
      addNotification: 'notifications/addNotification'
    }),
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
   * beforeRouteUpdate (to, from, next) {
     *   return this.checkSaved(to, from, next)
     * },
   * beforeRouteLeave (to, from, next) {
     *   return this.checkSaved(to, from, next)
     * }
   */
}
