<template>
  <div :class="barClass">
    <div class="level-left">
      <label class="checkbox custom">
        <input type="checkbox" v-model="autoSaveLocal" class="custom">
        <div class="indicator"></div>
        <span class="input-label">
          Auto-save
        </span>
      </label>
    </div>
    <div class="level-right has-text-right">
      <a v-if="isModified" class="button is-success" @click.prevent="save" :disabled="submitting">{{ buttonText }}</a>
      <span v-else>All changes saved<span class="section-label" v-if="label">({{ label }})</span></span>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    props: {
      endpointKey: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: false
      },
      autoSave: {
        type: Boolean,
        required: false,
        default: false
      },
      autoSaveCookie: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data () {
      return {
        autoSaveLocal: false,
        cookieExpires: '6M'
      }
    },
    computed: {
      ...mapGetters({
        isModifiedGetter: 'cms/isModified',
        getEndpoint: 'cms/getEndpoint',
        getSubmittingByKey: 'cms/getSubmittingByKey'
      }),
      isModified () {
        return this.isModifiedGetter(this.endpointKey)
      },
      barClass () {
        return [
          'level',
          'admin-bar',
          this.isModified ? 'is-modified' : ''
        ]
      },
      submitting () {
        return this.getSubmittingByKey(this.endpointKey)
      },
      buttonText () {
        return this.submitting ? 'Saving...' : 'Save Changes'
      },
      autoSaveVars () {
        return [this.isModified, this.submitting, this.autoSaveLocal]
      },
      cookieName () {
        return 'autoSave.' + this.endpointKey
      }
    },
    watch: {
      autoSaveVars: function () {
        this.checkAutoSave()
      },
      autoSaveLocal: function (newVal) {
        if (newVal) {
          this.$cookie.set(this.cookieName, true, { expires: this.cookieExpires })
        } else {
          this.$cookie.set(this.cookieName, false, { expires: this.cookieExpires })
        }
      }
    },
    methods: {
      ...mapActions({
        submit: 'cms/submit'
      }),
      checkAutoSave () {
        if (this.autoSaveLocal && this.isModified) {
          this.save()
        }
      },
      save () {
        this.submit({
          $axios: this.$axios,
          endpointKey: this.endpointKey
        })
      }
    },
    mounted () {
      this.autoSaveLocal = this.autoSave
      if (this.autoSaveCookie) {
        let curCookie = this.$cookie.get(this.cookieName)
        if (curCookie !== null) {
          this.$cookie.set(this.cookieName, curCookie, { expires: this.cookieExpires })
          this.autoSaveLocal = curCookie === 'true'
        }
      }
    }
  }
</script>

<style lang="sass">
  @import '~assets/sass/_vars'

  .admin-bar
    background: $green
    color: $white
    font-weight: bold
    height: 55px
    padding: .5rem
    position: relative
    transition: background .3s
    width: 100%
    z-index: 2000
    &.is-modified
      background: $orange
    .section-label
      display: block
      width: 100%
      font-size: .7rem
    .checkbox
      margin-top: 0
      &:hover
        color: inherit

  .layout
    > .admin-bar
      position: fixed
      ~ header
        margin-top: 55px
</style>
