<template>
    <form-tag :form="form" :novalidate="novalidate" :successFn="successFn" :failFn="failFn" :apiUrl="apiUrl">
        <slot name="errors">
            <div>
                <ul class="content" v-if="formErrors">
                    <li v-for="(error, index) in formErrors" :key="index"><h4 class="help is-danger" v-html="error"></h4></li>
                </ul>
            </div>
        </slot>
        <slot v-if="!getFormValid(formId)">
            <api-input v-for="input in form.children" :key="input.vars.unique_block_prefix" :input="input" :formId="formId" :disableValidation="disableValidation" />
        </slot>
        <slot name="success" v-else>
            <div class="content form-result">
                <h1 class="is-success">Thank you</h1>
                <p>The form has been successfully submitted. This is just a test form so nothing has happened except validation.</p>
                <p>On a real system you can easily add the functionality to send an email or any other action in the API.</p>
                <p><strong>You now continue your website expedition.</strong></p>
            </div>
        </slot>
    </form-tag>
</template>

<script>
    import FormTag from './_Form'
    import ApiInput from './ApiInput'
    import { mapGetters } from 'vuex'
    import _FormId from './_FormId'

    export default {
      mixins: [_FormId],
      name: 'ApiForm',
      props: {
        form: Object,
        novalidate: {
          'default': true
        },
        disableValidation: {
          type: Boolean,
          default: false
        },
        successFn: {
          type: Function,
          required: true
        },
        failFn: {
          type: Function,
          required: false,
          default: null
        },
        apiUrl: {
          type: Boolean,
          required: false,
          default: true
        }
      },
      computed: {
        ...mapGetters({
          getFormValid: 'forms/getFormValid',
          getFormErrors: 'forms/getFormErrors'
        }),
        formErrors () {
          return this.getFormErrors(this.formId)
        }
      },
      // serverCacheKey: props => props.form.id + '::' + props.form.lastModified,
      components: {
        FormTag,
        ApiInput
      }
    }
</script>
