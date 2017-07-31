<template>
  <section>
    <hero :title="page.header" :subtitle="page.subHeader" :patchUrl="page.patchUrl" />
    <section class="section">
      <div class="container">
        <div class="card home-brands-card">
          <header class="card-header">
            <h2 class="card-header-title">Built using these awesome frameworks:</h2>
          </header>
          <div class="card-content">
            <div class="columns is-desktop">
              <div class="column has-text-centered">
                <a class="is-inline-block" href="https://vuejs.org/" target="_blank" rel="noopener">
                  <image-loader
                    class="home-level-image h-100"
                    :src="$store.getters.getApiUrl('bundles/app/vue.svg')"
                    alt="Vue Framework Logo"
                  />
                  <p class="heading">Front-end Framework</p>
                  <p class="title">VueJS</p>
                </a>
              </div>
              <div class="column has-text-centered">
                <a class="is-inline-block" href="https://nuxtjs.org/" target="_blank" rel="noopener">
                  <image-loader
                    class="home-level-image h-100"
                    :src="$store.getters.getApiUrl('bundles/app/nuxt.svg')"
                    alt="Nuxt Framework Logo"
                  />
                  <p class="heading">VueJS Framework</p>
                  <p class="title">NuxtJS</p>
                </a>
              </div>
              <div class="column has-text-centered">
                <a class="is-inline-block" href="https://symfony.com/" target="_blank" rel="noopener">
                  <image-loader
                    class="home-level-image h-100"
                    :src="$store.getters.getApiUrl('bundles/app/symfony.svg')"
                    alt="Symfony PHP Framework logo"
                  />
                  <p class="heading">PHP Framework</p>
                  <p class="title">Symfony</p>
                </a>
              </div>
              <div class="column has-text-centered">
                <a class="is-inline-block" href="http://bulma.io/" target="_blank" rel="noopener">
                  <image-loader
                    class="home-level-image h-100"
                    :src="$store.getters.getApiUrl('bundles/app/bulma.svg')"
                    alt="Bulma CSS Framework Logo"
                  />
                  <p class="heading">CSS Framework</p>
                  <p class="title">Bulma</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column is-8-widescreen is-7-tablet">
            <text-block :content="page.body" :patchUrl="page.patchUrl" name="body" />

            <meta-description v-if="hasRole('ROLE_ADMIN')" :patchUrl="page.patchUrl" :metaDescription="page.metaDescription" />
          </div>
          <div class="column tweets-column">
            <twitter-feed />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
  import PageMixin from '~/plugins/ApiPageMixin'
  import Hero from '~/components/Template/Hero'
  import ImageLoader from '~/components/Template/ImageLoader'
  import TextBlock from '~/components/Template/TextBlock.vue'
  import TwitterFeed from '~/components/TwitterFeed/TwitterFeed'

  export default {
    data () {
      return {
        titleTemplate: '%s'
      }
    },
    mixins: [PageMixin],
    components: {
      Hero,
      ImageLoader,
      TextBlock,
      TwitterFeed,
      MetaDescription: () => import('~/components/Template/MetaDescription')
    },
    asyncData ({ app }) {
      return app.$getPage({
        slug: '',
        patchUrlPrefix: 'admin/pages',
        cmsKey: 'page'
      })
    }
  }
</script>

<style lang="sass">
  @import ~assets/sass/vars
  @import ~bulma/sass/utilities/mixins

  .home-brands-card
    border-radius: $radius
    overflow: hidden
    margin-bottom: 2.5rem
    .card-header
      background: $grey-lighter
      .card-header-title
        color: $grey
    .card-content
      background: $grey-lightest
      .column:not(:first-child)
        margin-top: 1rem
        padding-top: 1rem
        border-top: 1px solid $grey-lighter
        +desktop
          margin-top: 0
          padding-top: .75rem
          border-top: 0

  .home-level-image
    display: block
    position: relative
    height: 55px
    margin: auto auto 1rem
    min-width: 155px
    +desktop
      height: 110px
</style>
