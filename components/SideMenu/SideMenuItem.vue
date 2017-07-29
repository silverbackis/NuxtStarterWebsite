<template>
    <li>
        <nuxt-link
                v-if="menuItem.link.tag==='a'"
                :to="menuItem.link.href.replace('/', '\/')"
                :class="linkClass"
                :activeClass="ops.currentClass"
                @click.native="setLinkLoading"
        >
            <span v-html="menuItem.link.label"></span>
        </nuxt-link>
        <span v-else :class="menuItem.htmlAttributes.class" v-html="menuItem.link.label"></span>
    </li>
</template>

<script>
    export default {
      props: ['menuItem', 'ops'],
      data () {
        return {}
      },
      methods: {
        setLinkLoading () {
          this.$store.commit('mainNav/setLoadingEl', this.$el)
        }
      },
      computed: {
        linkClass () {
          let cls = {
            'side-menu-item': true,
            'is-loading': this.$store.getters['mainNav/loadingEl'] === this.$el
          }
          cls[this.menuItem.htmlAttributes.class] = true
          return cls
        }
      }
    }
</script>

<style lang="sass">
    @import '~assets/sass/_vars'

    .side-menu-item
        .draft
            font-size: .7rem
            color: $orange
</style>
