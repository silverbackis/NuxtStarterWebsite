<template>
  <div class="content">
    <h1>{{ page.header }}</h1>
    <h4 v-if="page.liveDate">
      page.liveDate is {{ page.liveDate }}
    </h4>
  </div>
</template>

<script>
  import PageMixin from '~/plugins/ApiPageMixin'

  export default {
    props: ['nuxtParent'],
    mixins: [PageMixin],
    asyncData ({ app, route }) {
      return app.$getPage({
        slug: route.fullPath.replace(/^\//, ''),
        patchUrlPrefix: 'admin/news',
        cmsKey: 'news'
      })
    }
  }
</script>
