<template>
    <section>
      <div v-if="page.hasChildren" class="column is-narrow">
        <side-menu :sideMenu="page.sideMenu" :topLabel="page.subLabel" addUrl="/admin/news" v-on:reloadSideMenu="reloadSideMenu" />
      </div>
      <div class="column column-content">
        <nuxt-child :key="$route.fullPath"
                    :nuxtParent="page"
                    v-on:reloadSideMenu="reloadSideMenu"
        />
      </div>
    </section>
</template>

<script>
  import SideMenu from '~/components/SideMenu/SideMenu.vue'
  import PageMixin from '~/plugins/ApiPageMixin'

  export default {
    mixins: [PageMixin],
    components: {
      SideMenu
    },
    asyncData ({ app, params }) {
      return app.$getPage({
        slug: params.page,
        patchUrlPrefix: 'admin/pages',
        cmsKey: 'page',
        menuSortBy: 'date',
        menuSortOrder: 'DESC'
      })
    }
  }
</script>
