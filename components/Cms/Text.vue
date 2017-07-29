<template>
  <input v-model="dataModel" :placeholder="placeholder" @blur="inputBlur" @focus="inputFocus" class="cms-input" />
</template>

<script>
  import _Input from './_Input'
  export default {
    mixins: [_Input]
  }
</script>
