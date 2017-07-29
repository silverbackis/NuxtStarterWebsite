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
                        <nuxt-child :body="page.body"
                                    :hasForm="page.form"
                                    :form="page.formData"
                                    :key="routerViewKey"
                                    :patchUrl="page.patchUrl"
                                    v-on:reloadSideMenu="reloadSideMenu"
                                    :metaDescription="page.metaDescription"
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
  import ApiPage from '~/pages/_ApiPage'

  export default {
    mixins: [ApiPage.mixins],
    components: {
      Hero,
      SideMenu
    },
    computed: {
      routerViewKey () {
        return this.$route.fullPath
      }
    },
    asyncData (context) {
      return ApiPage.getPage(context, {
        slug: context.params.page,
        patchUrlPrefix: 'admin/pages',
        cmsKey: 'page',
        menuSortBy: 'date',
        menuSortOrder: 'DESC'
      })
    }
  }
</script>
