<template>
  <cms-header-image v-if="hasRole('ROLE_ADMIN')"
                    :endpoint="endpoint"
                    :name="name"
                    :model="model"
  />
  <img v-else-if="model" :src="model.url" :alt="alt" class="header-image" />
</template>

<script>
  import Vue from 'vue'
  import { mapGetters } from 'vuex'

  export default {
    props: ['model', 'endpoint', 'name', 'alt'],
    computed: {
      ...mapGetters({
        hasRole: 'hasRole'
      })
    },
    created () {
      if (this.hasRole('ROLE_ADMIN')) {
        Vue.component('CmsHeaderImage', () => import('~/components/Cms/CmsHeaderImage'))
      }
    }
  }
</script>

<style lang="sass">
  @import ~assets/sass/vars

  .header-image
    position: relative
    width: 100%
    min-height: 100px
    &::after
      position: absolute
      width: 100%
      text-align: center
      content: 'News image here'
      padding: 2rem
      color: $white
</style>
