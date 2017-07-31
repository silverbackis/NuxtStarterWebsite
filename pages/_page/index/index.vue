<template>
  <div>
    <text-block :content="nuxtParent.body" :patchUrl="nuxtParent.patchUrl" name="body" />
    <div class="columns is-centered form-columns" v-if="form">
      <div class="column is-8-tablet">
        <div class="card">
          <div class="card-content">
            <api-form loaded-form :form="form" :successFn="getFormResponse" />
          </div>
        </div>
      </div>
    </div>
    <meta-description v-if="hasRole('ROLE_ADMIN')" :patchUrl="nuxtParent.patchUrl" :metaDescription="nuxtParent.metaDescription" />
  </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import TextBlock from '~/components/Template/TextBlock.vue'
  import ApiForm from '~/components/Form/ApiForm.vue'
  import _FormId from '~/components/Form/_FormId'

  export default {
    mixins: [_FormId],
    props: ['nuxtParent'],
    components: {
      TextBlock,
      ApiForm,
      MetaDescription: () => import('~/components/Template/MetaDescription'),
      Quill: () => import('~/components/Cms/Quill')
    },
    computed: {
      ...mapGetters({
        hasRole: 'hasRole'
      }),
      form () {
        return this.nuxtParent.formData
      }
    },
    methods: {
      ...mapMutations({
        setFormValid: 'forms/setFormValid'
      }),
      getFormResponse (res) {
        return this.setFormValid({
          formId: this.formId,
          valid: res.data.valid,
          errors: res.data.form.vars.errors,
          models: res.data.form.children
        })
      }
    }
  }
</script>

<style lang="sass">
  .form-columns
    margin-top: .5rem
</style>
