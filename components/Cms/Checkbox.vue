<template>
  <label class="checkbox custom">
    <input type="checkbox" v-model="dataModel" class="custom">
    <div class="indicator"></div>
    <span class="input-label">
      {{ label }}
    </span>
  </label>
</template>

<script>
  import _Input from './_Input'
  export default {
    mixins: [_Input],
    props: ['label']
  }
</script>
