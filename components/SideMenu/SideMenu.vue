<template>
  <div>
    <aside :class="asideClass">
      <p class="menu-label">
        {{ topLabel }}
      </p>
      <ul class="menu-list">
        <side-menu-item v-for="(child, index) in sideMenu.children" :key="index" :menuItem="child" :ops="sideMenu.options" />
      </ul>
    </aside>
    <a v-if="hasRole('ROLE_ADMIN')"
       href="#"
       :class="addButtonClass"
       :disabled="addingNew"
       @click.prevent="addNew"
    >
      + new
    </a>
  </div>
</template>

<script>
  import SideMenuItem from './SideMenuItem'
  import { mapGetters } from 'vuex'

  export default {
    props: ['sideMenu', 'topLabel', 'addUrl'],
    components: {
      SideMenuItem
    },
    data () {
      return {
        addingNew: false
      }
    },
    computed: {
      ...mapGetters({
        hasRole: 'hasRole'
      }),
      asideClass () {
        return [
          'column-aside',
          this.sideMenu.htmlAttributes.class
        ]
      },
      addButtonClass () {
        return [
          'button',
          'is-success',
          'is-fullwidth',
          'add-page-button',
          'is-medium'
        ]
      }
    },
    methods: {
      addNew () {
        this.addingNew = true
        this.$axios.post(this.$store.getters.getApiUrl(this.addUrl))
          .then((res) => {
            this.addingNew = false
            this.$emit('reloadSideMenu')
            if (res.data.newUrl) {
              this.$router.push(res.data.newUrl)
            }
          })
          .catch((err) => {
            this.addingNew = false
            alert('There was an error adding a new page')
            console.warn(err)
          })
      }
    }
  }
</script>

<style lang="sass">
  .menu-list
    a
      padding-right: 2.5rem
  .add-page-button
    margin-top: 1rem
    font-weight: bold
</style>
