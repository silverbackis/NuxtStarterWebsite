<!--
This component was inspired by: Louis Zawadzki
Github: https://github.com/louiszawadzki/vue-lazy-img-loading
Medium blog post: https://www.theodo.fr/blog/2017/02/medium-like-image-loading-with-vue-js-part-2/

Author modified: Daniel <daniel@silverback.is>
-->
<template>
    <transition-group
            name="fade"
            tag="div"
    >
        <div v-show="currentSrc === null" class="placeholder fade-transition" key="placeholder"></div>
        <canvas v-show="currentSrc === smallSrc" key="canvas" class="fade-transition"></canvas>
        <img v-show="currentSrc === src" :src="src" key="image" class="fade-transition" :alt="alt" />
        <div class="loader-outer fade-transition" key="loader" v-show="currentSrc !== src"><div class="loader is-primary"></div></div>
    </transition-group>
</template>

<script>
  export default {
    props: [
      'src',
      'smallSrc',
      'alt'
    ],
    data: () => ({
      currentSrc: null
    }),
    mounted () {
      let loResImg, hiResImg, that, context
      loResImg = new Image()
      hiResImg = new Image()
      that = this
      context = this.$el.getElementsByTagName('canvas')[0].getContext('2d')

      hiResImg.onload = function () {
        loResImg.onload = null
        that.currentSrc = that.src
      }

      loResImg.onload = function () {
        context.drawImage(loResImg, 0, 0)
        that.currentSrc = that.smallSrc
      }
      if (that.smallSrc && that.src.split('.').pop() !== 'svg') {
        loResImg.src = that.smallSrc
      }
      hiResImg.src = that.src
    }
  }
</script>

<style lang="sass" scoped>
    @import ~assets/sass/vars


    .h-100
        img,
        canvas
            height: 100%
    .w-100
        img,
        canvas
            width: 100%

    img,
    canvas,
    .placeholder
        height: auto
        width: auto
        position: relative
        top: 0
        left: 0

    .placeholder
        background-color: $grey-lightest
        filter: blur(10px)
        position: absolute
        width: 100%
        height: 100%

    canvas
        filter: blur(5px)
</style>
