<template>
  <div class="countdown-outer has-text-centered">
    <span class="countdown-title">website data refreshes every hour</span>
    <ul class="countdown">
      <li>
        <p class="digit">{{ minutes | twoDigits }}</p>
        <p class="countdown-label">Minutes</p>
      </li>
      <li>
        <p class="digit">{{ seconds | twoDigits }}</p>
        <p class="countdown-label">Seconds</p>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        now: new Date(),
        interval: null
      }
    },
    computed: {
      seconds () {
        return (this.secsToHour) % 60
      },
      minutes () {
        return Math.trunc(this.secsToHour / 60)
      },
      nowSecs () {
        return Math.round(this.now.getTime() / 1000)
      },
      secsToHour () {
        return 3600 - this.nowSecs % 3600
      }
    },
    filters: {
      twoDigits (value) {
        if (value.toString().length <= 1) {
          return '0' + value.toString()
        }
        return value.toString()
      }
    },
    created () {
      this.interval = setInterval(() => {
        this.now = new Date()
      }, 500)
    },
    beforeDestory () {
      clearInterval(this.interval)
    }
  }
</script>

<style lang="sass">
  @import '~assets/sass/_vars'
  .countdown-outer
    background: $grey-lightest
    padding: .5rem
  .countdown-title
    font-weight: bold
    text-align: center
    color: $grey
    font-size: .75rem
    display: block
  .countdown
    white-space: nowrap
    li
      display: inline-block
      padding: 0 .5rem
    .countdown-label
      color: $grey
      font-size: .75rem
    .digit
      color: $primary
      font-size: .9rem
</style>
