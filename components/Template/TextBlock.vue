<template>
  <div>
    <div v-if="!hasRole('ROLE_ADMIN')"
         :class="textClass"
         v-html="staticContent"
    ></div>
    <div v-else>
      <component :is="editor"
                 :model="content"
                 :endpoint="patchUrl"
                 :name="name"
      />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        staticContent: null
      }
    },
    components: {
      editor: () => import('~/components/Cms/Quill')
    },
    props: {
      content: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      patchUrl: {
        type: String,
        required: false,
        default: ''
      }
    },
    computed: {
      ...mapGetters({
        hasRole: 'hasRole'
      }),
      textClass () {
        return [
          'content',
          this.$route.name
        ]
      }
    },
    methods: {
      updateContent (newContent) {
        this.staticContent = newContent
      }
    },
    created () {
      this.staticContent = this.content
    }
  }
</script>
