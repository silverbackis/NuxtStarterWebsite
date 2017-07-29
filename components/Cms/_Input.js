import _ from 'lodash'
import { mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      debounce: null,
      value: null,
      newUrl: null,
      focussed: false
    }
  },
  props: {
    endpoint: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    model: {
      required: true
    },
    placeholder: {
      type: String,
      required: false
    },
    reloadSideMenu: {
      type: Boolean,
      required: false,
      default: false
    },
    redirectAfterSave: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    dataModel: {
      get () {
        return this.model
      },
      set (model) {
        if (this.debounce) {
          this.debounce.cancel()
        }
        this.debounce = _.debounce(() => {
          this.setStoreValue(model)
        }, 350)
        this.debounce()
        this.$emit('modelChanged', model)
      }
    }
  },
  methods: {
    ...mapMutations({
      initInput: 'cms/initInput'
    }),
    ...mapActions({
      setInputValue: 'cms/setInputValue'
    }),
    extendModelIds (data) {
      return Object.assign(
        {
          endpoint: this.endpoint,
          inputName: this.name
        },
        data
      )
    },
    setStoreValue (value) {
      this.setInputValue(this.extendModelIds({
        inputValue: value
      }))
    },
    inputFocus () {
      this.focussed = true
    },
    inputBlur () {
      this.focussed = false
      this.goToNewUrl()
    },
    goToNewUrl () {
      if (this.redirectAfterSave && this.newUrl && this.$router.currentRoute.fullPath !== this.newUrl) {
        this.$router.replace(this.newUrl)
      }
    }
  },
  watch: {
    endpoint: function () {
      this.initInput(this.extendModelIds({
        inputValue: this.model
      }))
    }
  },
  mounted () {
    this.initInput(this.extendModelIds({
      inputValue: this.model,
      afterSave: (newUrl) => {
        if (this.reloadSideMenu) {
          this.$emit('reloadSideMenu')
        }
        if (this.redirectAfterSave) {
          this.newUrl = newUrl
          if (!this.focussed) {
            this.goToNewUrl()
          }
        }
      }
    }))
  }
}
