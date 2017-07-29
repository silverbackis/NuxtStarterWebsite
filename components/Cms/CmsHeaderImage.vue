<template>
  <form :action="endpoint" class="dropzone">
    <slot></slot>
  </form>
</template>

<script>
  import _Input from './_Input'

  export default {
    name: 'DropzoneComponent',
    mixins: [_Input],
    data () {
      return {
        dropzone: null,
        uploadedFile: null,
        dropzoneOps: {
          dictDefaultMessage: '<i class="fa fa-cloud-upload"></i><br>Click or drag new header image here',
          thumbnailMethod: 'contain',
          maxFileSize: 10,
          thumbnailWidth: 2140,
          thumbnailHeight: null,
          resizeWidth: 2140,
          method: 'POST',
          maxFiles: 1,
          addRemoveLinks: true,
          withCredentials: true
        }
      }
    },
    methods: {
      template: () => {
        return `
          <div class="dz-preview dz-file-preview">
              <div class="dz-image">
                  <img data-dz-thumbnail />
                  <div class="dz-success-mark"><span class="dz-icon-outer"><i class="fa fa-check"></i></span></div>
                  <div class="dz-error-mark"><span class="dz-icon-outer"><i class="fa fa-close"></i></span></div>
                  <div class="dz-details">
                    <div class="dz-size"><span data-dz-size></span></div>
                    <div class="dz-filename"><span data-dz-name></span></div>
                  </div>
                  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
              </div>
              <div class="dz-error-message"><span data-dz-errormessage></span></div>
          </div>
        `
      }
    },
    mounted () {
      if (this.$isServer) {
        return
      }

      let Dropzone = require('dropzone')
      Dropzone.autoDiscover = false

      const addMock = (mockFile) => {
        mockFile.replacing = false
        mockFile.status = 'success'
        mockFile.accepted = true
        this.dropzone.files.push(mockFile)
        this.dropzone.emit('addedfile', mockFile)
        this.dropzone.emit('thumbnail', mockFile, mockFile.url)
        this.dropzone.emit('complete', mockFile)
        return mockFile
      }

      this.dropzone = new Dropzone(
        this.$el,
        Object.assign(
          {
            headers: {
              'X-XSRF-TOKEN': this.$cookie.get('XSRF-TOKEN')
            },
            paramName: this.name,
            previewTemplate: this.template()
          },
          this.dropzoneOps
        )
      )

      this.dropzone.on('addedfile', function () {
        if (this.files.length > this.options.maxFiles) {
          // replacing on the server (a single column) - so we don't need to submit to server to delete it
          this.files[0].replacing = this.options.maxFiles === 1
          this.removeFile(this.files[0])
        }
      })

      this.dropzone.on('maxfilesexceeded', function (file) {
        this.removeFile(file, false)
      })

      this.dropzone.on('removedfile', (file) => {
        // Here we will detect whether to remove a file from the server, or perhaps display
        // an image already on the server
        if (!file.replacing) {
          // Have we just removed a file that was erroneous anyway?
          if (file.status !== 'success') {
            // The file hadn't been uploaded successfully
            // Can we revert the display to a previous image?
            if (this.dropzone.options.maxFiles === 1) {
              // It is just a single column, so did we have a file before?
              if (this.uploadedFile) {
                // Yes we did know of a file uploaded before this one
                // Add it again as soon as this one has been removed (doing it straight away means the 'drop here' notice shows)
                this.$nextTick(() => {
                  this.uploadedFile = addMock(this.uploadedFile)
                  file.previewElement.querySelector('[data-dz-remove]').textContent = this.dropzone.options.dictRemoveFile
                })
              }
            }
          } else {
            // this file that was being shown has a success status
            // now it's being removed, we should remove from the server too
            let patchObj = {}
            patchObj[this.name] = ''
            this.$axios.patch(this.endpoint, patchObj)
              .then(() => {
                this.uploadedFile = null
              })
              .catch((err) => {
                console.warn('error removing image', err)
                this.uploadedFile = addMock(this.uploadedFile)
              })
          }
        }
      })

      this.dropzone.on('success', (file, res) => {
        // update data so we know current server file if the failed image is removed
        this.uploadedFile = res.data[this.name]
        file.previewElement.querySelector('[data-dz-name]').textContent = this.uploadedFile.name
      })

      this.dropzone.on('error', (file, res) => {
        if (res.errors) {
          file.previewElement.querySelector('[data-dz-errormessage]').textContent = res.errors.errors[0]
        } else if (res.message) {
          file.previewElement.querySelector('[data-dz-errormessage]').textContent = res.message
        }
        this.$nextTick(() => {
          file.previewElement.querySelector('[data-dz-remove]').textContent = 'Re-show current'
        })
      })

      if (this.dataModel) {
        this.uploadedFile = addMock(this.dataModel)
      }
    }
  }
</script>

<style lang="sass">
  @import ~dropzone/dist/dropzone.css
  @import ~assets/sass/vars

  .dropzone
    display: inline-block
    position: relative
    width: 100%
    min-height: 0
    letter-spacing: 0.2px
    color: $grey
    transition: background .3s
    border: 3px dashed $grey-light
    padding: 0
    &:hover
      background-color: $grey-lightest
    &.dz-drag-hover
      border: 3px dashed $green
      .dz-message
        opacity: 1
        color: $green
    .dz-default.dz-message
      .fa
        font-size: 4rem
    .dz-preview
      margin: 0
      width: 100%
      .dz-image
        border-radius: 0
        width: 100%
        height: auto
        img
          width: 100%
      .dz-error-mark,
      .dz-success-mark
        color: $white
        left: 0
        margin: -1.5rem 0 0
        width: 100%
        text-align: center
        font-size: 3rem
        line-height: 3rem
        top: 50%
      .dz-icon-outer
        display: inline-block
        margin-top: -1rem
        padding: 2rem
        background: rgba($grey-dark, .75)
        border-radius: 50%
      .dz-error-mark
        .dz-icon-outer
          background: rgba($red, .75)
      .dz-success-mark
        .dz-icon-outer
          background: rgba($green, .75)
      &:hover
        .dz-error-mark
          opacity: 0
      .dz-error-message
        top: 100%
        width: 100%
      .dz-remove
        padding: .3rem
        background: $grey
        color: $white
        font-weight: bold
        font-size: 1rem
        transition: background .3s
        &:hover
          text-decoration: none
          background: $danger
      &.dz-image-preview
        background: transparent
</style>
