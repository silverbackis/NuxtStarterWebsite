<template>
  <div class="layout">
    <cms-bar v-if="hasRole('ROLE_ADMIN')" endpointKey="page" label="Top level page" />
    <header>
      <main-nav />
    </header>

    <nuxt :nuxtChildKey="nuxtChildKey" />

    <notifications />

    <footer class="footer">
      <div class="container has-text-right">
        <a v-if="authUser"
           href="#"
           @click.prevent="logout"
        >Logout</a>
        <nuxt-link v-else
                   to="/admin/login"
        >Admin login</nuxt-link> | <a href="https://github.com/silverbackis/StarterWebsite" target="_blank" rel="noopener">GitHub Repo</a>
      </div>
    </footer>
  </div>
</template>

<script>
  import CmsBar from '~/components/Cms/CmsBar'
  import MainNav from '~/components/MainNav/MainNav.vue'
  import Notifications from '~/components/Template/Notifications/Notifications'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    components: {
      CmsBar,
      Notifications,
      MainNav
    },
    methods: {
      ...mapMutations({
        addNotification: 'notifications/addNotification',
        setAuthUser: 'setAuthUser'
      }),
      logout () {
        this.$axios.post('/logout',
          {
            _action: this.getApiUrl('logout')
          },
          {
            baseURL: null
          }
        )
          .then(() => {
            this.addNotification('You have successfully logged out')
            this.setAuthUser(null)
          })
          .catch((err) => {
            console.warn(err)
          })
      }
    },
    computed: {
      ...mapGetters({
        getAuthUser: 'getAuthUser',
        getApiUrl: 'getApiUrl',
        hasRole: 'hasRole'
      }),
      authUser () {
        return this.getAuthUser()
      },
      nuxtChildKey () {
        return this.$route.fullPath.split('/')[1]
      }
    },
    head () {
      return {
        title: 'Loading...',
        meta: [
          { hid: 'theme', name: 'theme-color', content: '#4770fb' }
        ],
        htmlAttrs: { lang: 'en' }
      }
    },
    mounted () {
      // Not using font awesome immediately in this website, so no need to include it in the head of page
      require('font-awesome/css/font-awesome.css')
    }
  }
</script>

<style src="~/assets/sass/layouts/default.sass" lang="sass" />
