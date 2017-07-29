<template>
    <div>
        <text-block :content="body" :patchUrl="patchUrl" name="body" />
        <div class="columns is-centered form-columns" v-if="hasForm">
            <div class="column is-8-tablet">
                <div class="card">
                    <div class="card-content">
                        <api-form loaded-form :form="form" :successFn="getFormResponse" />
                    </div>
                </div>
            </div>
        </div>
        <meta-description v-if="hasRole('ROLE_ADMIN')" :patchUrl="patchUrl" :metaDescription="metaDescription" />
    </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex'
  import TextBlock from '~/components/Template/TextBlock.vue'
  import ApiForm from '~/components/Form/ApiForm.vue'
  import _FormId from '~/components/Form/_FormId'
  import MetaDescription from '~/components/Template/MetaDescription'
  import Quill from '~/components/Cms/Quill'

  export default {
    mixins: [_FormId],
    props: ['body', 'form', 'hasForm', 'patchUrl', 'metaDescription'],
    components: {
      TextBlock,
      ApiForm,
      MetaDescription,
      Quill
    },
    computed: {
      ...mapGetters({
        hasRole: 'hasRole'
      })
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
