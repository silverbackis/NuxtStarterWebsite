<template>
    <section>
      <hero :title="page.header" :subtitle="page.subHeader" :patchUrl="page.patchUrl" />
      <section class="section">
          <div class="container">
              <div class="columns">
                  <div v-if="page.hasChildren" class="column is-narrow">
                      <side-menu :sideMenu="page.sideMenu" :topLabel="page.subLabel" addUrl="/admin/news" v-on:reloadSideMenu="reloadSideMenu" />
                  </div>
                  <div class="column column-content">
                      <nuxt-child :key="routerViewKey"
                                  :nuxtParent="page"
                                  v-on:reloadSideMenu="reloadSideMenu"
                      />
                  </div>
              </div>
          </div>
      </section>
    </section>
</template>

<script>
  import Hero from '~/components/Template/Hero.vue'
  import SideMenu from '~/components/SideMenu/SideMenu.vue'
  import PageMixin from '~/plugins/ApiPageMixin'

  export default {
    mixins: [PageMixin],
    components: {
      Hero,
      SideMenu
    },
    computed: {
      routerViewKey () {
        return this.$route.fullPath
      }
    },
    asyncData ({ app, params }) {
      return app.$getPage({
        slug: params.page,
        patchUrlPrefix: 'admin/pages',
        cmsKey: 'page',
        menu: {
          sortBy: 'date',
          order: 'DESC'
        }
      })
    }
  }
</script>
