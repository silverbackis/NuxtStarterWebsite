<template>
  <div class="card card-outer">
    <div class="card-header">
      <h2 class="card-header-title">Tweets by&nbsp;<a href="https://twitter.com/silverbackis" target="_blank" rel="noopener">@silverbackis</a></h2>
    </div>
    <transition-group
      class="card-content"
      name="fade"
      tag="div"
    >
      <tweet v-for="tweet in tweets" :tweet="tweet" v-show="loaded" key="tweet" class="fade-transition" />
      <div class="loader-outer fade-transition" v-show="!loaded" key="loader">
        <div class="loader is-primary"></div>
      </div>
    </transition-group>
  </div>
</template>

<script>
  import Tweet from './Tweet'
  import axios from 'axios'

  export default {
    data () {
      return {
        tweets: [],
        loaded: false
      }
    },
    components: {
      Tweet
    },
    asyncData (context) {
      return {
        tweets: []
      }
    },
    mounted () {
      let url = this.$store.getters.getApiUrl('tweets')
      return axios.get(url)
        .then((res) => {
          this.tweets = res.data
          this.loaded = true
        })
    }
  }
</script>

<style lang="sass" scoped >
  @import ~assets/sass/vars

  .loader-outer
    top: 70px
  .card-content
    min-height: 150px
    position: relative
  .card-outer
    border-radius: $radius
    overflow: hidden
    +mobile
      margin-top: 2rem
</style>
