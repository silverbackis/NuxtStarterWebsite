<template>
  <div :class="'content ' + $route.name">
    <cms-bar v-if="hasRole('ROLE_ADMIN')" endpointKey="news" label="News Post" :autoSave="true" />
    <div class="columns is-gapless news-dates-columns">
      <div class="column is-3">
        <cms-checkbox v-if="hasRole('ROLE_ADMIN')"
                      :model="modelLive"
                      :endpoint="page.patchUrl"
                      name="live"
                      label="Live"
                      :reloadSideMenu="true"
                      v-on:reloadSideMenu="reloadSideMenu"
        ></cms-checkbox>
      </div>
      <div class="column news-dates has-text-right" v-if="page.liveDate">
        <ul>
          <li>{{ page.liveDate | formatDate }}</li>
          <li v-if="page.lastUpdated !== page.liveDate">Last Updated: {{ page.lastUpdated | formatDate }}</li>
        </ul>
      </div>
    </div>
    <div class="columns is-gapless">
      <div class="column">
        <header-image :model="modelHeaderImage"
                      :endpoint="page.patchUrl"
                      name="headerImage"
                      :alt="page.header + ' - news header image'"
        />
        <h1 class="news-header">
          <cms-text-input v-if="hasRole('ROLE_ADMIN')"
                          :model="modelHeader"
                          :endpoint="page.patchUrl"
                          name="header"
                          placeholder="Enter news header here"
                          :reloadSideMenu="true"
                          :redirectAfterSave="true"
                          v-on:reloadSideMenu="reloadSideMenu" />
          <span v-else>{{ page.header }}</span>
        </h1>
        <text-block :content="page.body" :patchUrl="page.patchUrl" name="body" />
        <div v-if="hasRole('ROLE_ADMIN')" class="has-text-right">
          <a href="#" class="delete-news-link" @click.prevent="deleteNews">delete news</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import ApiPage from '~/pages/_ApiPage'
  import TextBlock from '~/components/Template/TextBlock.vue'
  import HeaderImage from '~/components/Template/HeaderImage.vue'
  import CmsBar from '~/components/Cms/CmsBar'
  import CmsTextInput from '~/components/Cms/Text'
  import CmsCheckbox from '~/components/Cms/Checkbox'
  import Fecha from 'fecha'

  export default {
    mixins: [ApiPage.mixins],
    components: {
      TextBlock,
      CmsBar,
      CmsTextInput,
      CmsCheckbox,
      HeaderImage
    },
    filters: {
      formatDate (value) {
        if (value) {
          return Fecha.format(new Date(value), 'Do MMM YYYY h:mm a')
        }
      }
    },
    computed: {
      ...mapGetters({
        hasRole: 'hasRole'
      }),
      modelHeader () {
        return this.page.header
      },
      modelLive () {
        return this.page.live
      },
      modelHeaderImage () {
        return this.page.headerImage
      }
    },
    asyncData (context) {
      return ApiPage.getPage(context, {
        slug: context.route.fullPath.replace(/^\//, ''),
        patchUrlPrefix: 'admin/news',
        cmsKey: 'news'
      })
    },
    methods: {
      ...mapMutations({
        addNotification: 'notifications/addNotification'
      }),
      reloadSideMenu () {
        this.$emit('reloadSideMenu')
      },
      deleteNews () {
        this.$axios.delete(this.page.patchUrl)
          .then((res) => {
            this.$emit('reloadSideMenu')
            this.$router.replace('/news')
            this.addNotification('News item successfully deleted')
          })
          .catch((err) => {
            alert('Error deleting news item')
            console.warn(err)
          })
      }
    }
  }
</script>

<style lang="sass">
  @import ~assets/sass/_vars
  .news-dates
    color: $grey
    font-size: .8rem
    margin-bottom: .5rem
    ul
      list-style: none
      padding: 0
      margin: 0
  .delete-news-link
    color: $red
    display: inline-block
    font-size: .8rem
    margin-top: 2rem
  .news-dates-columns
    .checkbox
      margin-top: 0
</style>
