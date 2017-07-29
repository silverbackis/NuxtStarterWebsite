<template>
    <div>
        <section class="hero is-primary">
            <div class="hero-body">
                <div class="container">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <h1 class="title">
                                <cms-text-input v-if="hasRole('ROLE_ADMIN')" :model="modelTitle" :endpoint="patchUrl" name="header" placeholder="Enter page title here" />
                                <span v-else>{{ title }}</span>
                            </h1>
                            <h2 class="subtitle" v-if="subtitle || hasRole('ROLE_ADMIN')">
                                <cms-text-input v-if="hasRole('ROLE_ADMIN')" :model="modelSubTitle" :endpoint="patchUrl" name="subHeader" placeholder="Enter optional subtitle here" />
                                <span v-else>{{ subtitle }}</span>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import CmsTextInput from '~/components/Cms/Text'

  export default {
    components: {
      CmsTextInput
    },
    props: {
      title: {
        type: String,
        required: true
      },
      subtitle: {
        type: String,
        required: false
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
      modelTitle () {
        return this.title
      },
      modelSubTitle () {
        return this.subtitle || ''
      }
    }
  }
</script>
