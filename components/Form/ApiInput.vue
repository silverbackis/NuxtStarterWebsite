<template>
    <component :is="inputComponent"
               :input="input"
               :formId="formId"
               :noSelectWrap="noSelectWrap"
               :lastBlockPrefix="lastBlockPrefix"
               :disableValidation="disableValidation"
    />
</template>

<script>
  export default {
    props: {
      input: {
        type: Object,
        required: true
      },
      inputOnly: {
        type: Boolean,
        default: false
      },
      noSelectWrap: {
        type: Boolean,
        default: false
      },
      formId: {
        type: String,
        required: true
      },
      disableValidation: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        inputComponentType: null,
        lastBlockPrefix: null,
        availableComponents: [
          'simple',
          'textarea',
          'choice',
          'button',
          'checkbox'
        ],
        inputComponent: null
      }
    },
    computed: {
      inputComponentDir () {
        return this.inputOnly ? 'Input' : 'Wrapped'
      }
    },
    methods: {
      isInputType (InputType) {
        return this.availableComponents.indexOf(InputType) !== -1
      },
      toPascalCase (str) {
        return str.split('_').map(function (item) {
          return item.charAt(0).toUpperCase() + item.substring(1)
        }).join('')
      },
      resolveInputComponent () {
        for (let bp of this.input.vars.block_prefixes) {
          if (this.isInputType(bp)) {
            this.inputComponentType = bp
          }
          if (bp !== this.input.vars.unique_block_prefix) {
            this.lastBlockPrefix = bp
          }
        }
        this.inputComponent = () => ({
          component: import('./Type/' + this.inputComponentDir + '/' + this.toPascalCase(this.inputComponentType))
        })
      }
    },
    created () {
      // Set Default
      this.inputComponentType = this.availableComponents[0]
      this.resolveInputComponent()
    }
  }
</script>
