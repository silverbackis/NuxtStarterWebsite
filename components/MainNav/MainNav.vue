<template>
  <div class="columns">
    <div class="column">
      <countdown />
      <div class="columns">
        <div class="column">
          <nav class="nav has-shadow">
            <div class="container">
              <div class="nav-left">
                <div class="nav-item is-paddingless">
                  <nuxt-link to="/" exact>
                    <img src="~assets/images/bw-logo.svg" alt="British Websites logo" class="logo" />
                  </nuxt-link>
                </div>
              </div>
              <a
                :class="{'nav-toggle-bw': true, 'nav-toggle-active': showNav }"
                aria-controls="mobileNavCollapse"
                :aria-expanded="showNav ? 'true' : 'false'"
                aria-label="Toggle menu"
                @click.prevent="showNav = !showNav"
                v-on-clickaway="toggleClickaway"
              >
                <span class="toggle-line"></span>
                <span class="toggle-line"></span>
                <span class="toggle-line"></span>
                <span class="text">Menu</span>
              </a>
              <collapse id="mobileNavCollapse">
                <div class="nav-right nav-menu" v-show="showNav">
                  <main-nav-item v-for="(child, index) in navMenuLinks" :key="index" :link="child.link" />
                </div>
              </collapse>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mixin as clickaway } from 'vue-clickaway'
  import Collapse from '~/components/Template/Collapse.vue'
  import MainNavItem from './MainNavItem'
  import Countdown from './Countdown'

  export default {
    mixins: [ clickaway ],
    data: () => ({
      showNav: false
    }),
    components: {
      Collapse,
      MainNavItem,
      Countdown
    },
    computed: {
      navMenu () {
        return this.$store.state.mainNav.menu
      },
      navMenuLinks () {
        return this.navMenu ? this.navMenu.children : []
      }
    },
    methods: {
      toggleClickaway () {
        this.showNav = false
      }
    }
  }
</script>

<style lang="sass">
  @import ~assets/sass/vars
  @import ~bulma/sass/utilities/mixins

  .nav
    height: auto
    padding: 0 1.5rem
    .container
      padding: 1rem 0
    a.nav-item.is-tab
      transition: color .15s, background .3s, padding-left .25s
      align-self: center
      &:hover:not(.is-active):not(.is-loading)
        border-bottom: 0
        padding-bottom: .75rem
        color: $secondary
      +tablet
        &.is-loading
          border-bottom: 3px solid $grey-lightest
          color: $grey-lighter
          padding-bottom: calc(.75rem - 3px)
          position: relative
          &::after
            +loader
            border-color: transparent transparent $primary $primary
            left: calc(50% - (1em / 2))
            top: calc(50% - (1em / 2))
            position: absolute !important

    .logo
      height: 57px
      max-height: none
    .nav-toggle-bw
      align-self: center
      border: 1px solid $grey-lighter
      transition: background .25s, border-color .25s
      cursor: pointer
      display: block
      height: 3.25rem
      position: relative
      width: 3.25rem
      padding: .5rem 0
      .toggle-line
        background-color: $primary
        transition: background .35s
        display: block
        height: 1px
        left: 50%
        margin-left: -7px
        margin-top: 4px
        position: relative
        width: 15px
        &:nth-child(2)
          margin-left: -5px
      .text
        color: $primary
        font-size: .75rem
        transition: color .25s
      &:hover,
      &.nav-toggle-active
        background: $grey-lightest
        border-color: $secondary
        .text
          color: $secondary
        .toggle-line
          background-color: $secondary
  .menu-list
    a
      transition: background .3s, color .3s
      position: relative
      &.is-loading,
      &:hover:not(.is-active)
        background-color: $grey-lightest
        color: $primary
      &.is-loading::after
        +loader
        position: absolute
        right: .5rem
        top: 50%
        margin-top: -.5rem
        border-color: transparent transparent $primary $primary
  +mobile
    .nav
      .nav-menu
        box-sizing: content-box
        border-top: 1px solid $grey-lighter
        border-bottom: 3px solid $secondary
        margin-left: -1.5rem
        margin-right: -1.5rem
        max-width: 100vw
      a.nav-item.is-tab
        border-bottom: 0
        padding: .75rem
        &.is-active
          border-bottom: 0
        &:hover
          padding-left: 1rem
          background: $grey-lightest
          &:not(.is-active)
            color: $grey-darker

  +tablet
    .nav
      .nav-toggle-bw
        display: none
      .nav-menu
        align-self: center
        display: flex !important
        height: auto !important

  +widescreen
    .nav
      padding: 0
</style>
