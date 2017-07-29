<template>
    <div class="page-progress" :style="{
    'width': percent+'%',
    'opacity': show ? 1 : 0
  }"></div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'nuxt-loading',
    data () {
      return {
        percent: 0,
        show: false,
        unsetLoadingEl: false,
        canSuccess: true
      }
    },
    methods: {
      start () {
        this.show = true
        this.unsetLoadingEl = false
        this.canSuccess = true
        setTimeout(() => {
          if (!this.unsetLoadingEl) {
            this.$store.commit('mainNav/setLoading')
          }
        }, 1)
        return this
      },
      set (num) {
        this.show = true
        this.canSuccess = true
        this.percent = Math.floor(num)
        return this
      },
      get () {
        return Math.floor(this.percent)
      },
      increase (num) {
        this.percent = this.percent + Math.floor(num)
        return this
      },
      decrease (num) {
        this.increase(num)
        return this
      },
      finish () {
        this.percent = 100
        this.hide()
        return this
      },
      hide () {
        setTimeout(() => {
          this.show = false
          Vue.nextTick(() => {
            setTimeout(() => {
              this.percent = 0
            }, 200)
          })
        }, 500)
        this.unsetLoadingEl = true
        this.$store.commit('mainNav/setLoadingEl', null)
        return this
      },
      fail () {
        this.canSuccess = false
        this.unsetLoadingEl = true
        this.$store.commit('mainNav/setLoadingEl', null)
        return this
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '~assets/sass/vars'

  .page-progress
    position: fixed
    top: 0
    left: 0
    right: 0
    height: 3px
    width: 0%
    transition: width 0.2s, opacity 0.4s
    opacity: 1
    background-color: $secondary
    z-index: 999999
</style>
