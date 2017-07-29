<template>
    <section class="page-section">
        <div class="columns is-centered">
            <div class="column is-narrow">
                <div class="card">
                    <div class="card-header">
                        <h1 class="card-header-title">Administration</h1>
                    </div>
                    <div class="card-content">
                        <api-form loaded-form
                                  v-if="form"
                                  :form="form"
                                  :disableValidation="true"
                                  :successFn="formSuccess"
                                  :failFn="formFail"
                                  :apiUrl="false"
                        />
                        <span class="help is-success">
                            <ul>
                                <li>Username: admin</li>
                                <li>(or Email: admin@admin.com)</li>
                                <li>Password: admin</li>
                            </ul>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
  import ApiForm from '~/components/Form/ApiForm.vue'
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  import _FormId from '~/components/Form/_FormId'
  import jwtDecode from 'jwt-decode'

  export default {
    mixins: [_FormId],
    head: {
      title: 'Admin Login',
      meta: [
        { hid: 'description', name: 'description', content: '' }
      ]
    },
    components: {
      ApiForm
    },
    computed: {
      ...mapGetters({
        getApiUrl: 'getApiUrl',
        getAuthUser: 'getAuthUser'
      })
    },
    methods: {
      ...mapMutations({
        setFormValid: 'forms/setFormValid',
        destroyForm: 'forms/destroyForm',
        setAuthUser: 'setAuthUser',
        addNotification: 'notifications/addNotification'
      }),
      ...mapActions({
        authorized: 'authorized'
      }),
      formSuccess (res) {
        this.setAuthUser(jwtDecode(res.data.token))
        this.$router.replace('/')
      },
      formFail (err) {
        if (err.response.status === 401) {
          return this.setFormValid({
            formId: this.formId,
            valid: err.response.data.valid,
            errors: err.response.data.form.vars.errors,
            models: err.response.data.form.children
          })
        }
      }
    },
    asyncData ({ app, store }) {
      return app.$axios.get(store.getters.getApiUrl('login'))
        .then((res) => {
          let form = res.data
          form.vars.action = '/login'
          form.children._action.vars.value = store.getters.getApiUrl(form.children._action.vars.value)
          return {
            form: form
          }
        })
        .catch((err) => {
          console.warn('Could not load form', err)
        })
    },
    mounted () {
      let authUser = this.getAuthUser()
      if (authUser) {
        this.addNotification('You are already logged in')
        this.$router.replace('/')
      }
    },
    beforeDestroy () {
      this.destroyForm(this.formId)
    }
  }
</script>

<style lang="sass" scoped >
    .card
        width: 300px
        margin-top: 2rem
    .media
        margin: 1rem
</style>
