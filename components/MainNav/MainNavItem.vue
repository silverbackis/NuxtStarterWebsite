<template>
    <nuxt-link
            :to="link.href"
            :class="linkClass"
            :active-class="activeClass"
            :exact="link.href === '/'"
            @click.native="setLinkLoading()"
    >
        {{ link.label }}
    </nuxt-link>
</template>

<script>
    export default {
      props: ['link'],
      data: () => ({
        activeClass: 'is-active'
      }),
      computed: {
        linkClass () {
          let cls = {
            'is-loading': this.$store.getters['mainNav/loadingEl'] === this.$el
          }
          cls['nav-item'] = true
          cls['is-tab'] = true
          return cls
        }
      },
      methods: {
        setLinkLoading () {
          this.$store.commit('mainNav/setLoadingEl', this.$el)
        }
      }
    }
</script>
