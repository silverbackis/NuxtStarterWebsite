<template>
  <div class="field meta-field">
    <label class="label">Custom Meta Description (SEO)</label>
    <div class="control">
      <cms-text-input class="input"
                      :model="metaDescription"
                      :endpoint="patchUrl"
                      name="metaDescription"
                      placeholder="Enter a custom meta description for SEO here"
      />
    </div>
  </div>
</template>

<script>
  import CmsTextInput from '~/components/Cms/Text'

  export default {
    props: ['patchUrl', 'metaDescription'],
    components: {
      CmsTextInput
    }
  }
</script>

<style lang="sass">
  .meta-field
    margin-top: 2rem
</style>
