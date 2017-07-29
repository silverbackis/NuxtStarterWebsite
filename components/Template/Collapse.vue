<template>
    <transition
            @beforeEnter="beforeEnter"
            @afterEnter="afterEnter"
            @beforeLeave="beforeLeave"
            @afterLeave="afterLeave"
    >
        <slot></slot>
    </transition>
</template>

<script>
  export default {
    methods: {
      beforeEnter (el) {
        el.classList.add('is-active', 'collapsing')
        el.style.display = 'block'
        el.style.height = `${el.scrollHeight}px`
      },
      afterEnter (el) {
        el.classList.remove('collapsing')
      },
      beforeLeave (el) {
        el.classList.add('collapsing')
        el.style.height = 0
      },
      afterLeave (el) {
        el.classList.remove('is-active', 'collapsing')
        el.style.display = ''
      }
    }

  }
</script>

<style lang="scss" scoped>
    .collapsing {
        height: 0;
        overflow: hidden;
        transition: height 350ms ease;
    }
</style>
