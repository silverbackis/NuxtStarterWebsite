<template>
  <div class="content quill-editor"
       v-model="dataModel"
       v-quill:cmsQuill="editorOption"
       @ready="onEditorReady($event)"
  ></div>
</template>

<script>
  import _Input from './_Input'

  export default {
    name: 'cmsQuill',
    mixins: [_Input],
    data () {
      return {
        editorOption: {
          // some quill options
          modules: {
            toolbar: [
              [{ 'header': [1, 2, 3, 4, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['code', 'code-block'],
              ['clean']
            ]
          }
        }
      }
    },
    methods: {
      onEditorReady: function () {
        setTimeout(() => {
          this.initInput({
            endpoint: this.endpoint,
            inputName: this.name,
            inputValue: this.dataModel
          })
        }, 1)
      }
    }
  }
</script>

<style src="~/assets/sass/quill.min.sass" lang="sass" />

<style lang="sass">
  .ql-container
    font-size: inherit
    height: auto
</style>
