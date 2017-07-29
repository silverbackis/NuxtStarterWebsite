<template>
    <div class="card">
        <div class="card-content">
            <div class="content is-small">
                <span v-html="tweet.html_text"></span>
                <br>
                <small class="level">
                    <span class="level-left">{{ tweet.date }}</span>
                    <a :href="'https://twitter.com/statuses/' + tweet.id_str" target="_blank" class="level-right" rel="noopener">view tweet</a>
                </small>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
      props: ['tweet']
    }
</script>

<style lang="sass" scoped>
    @import '~assets/sass/vars'
    @import '~bulma/sass/utilities/mixins'
    .level
        margin-top: .5rem
    +desktop
        .content
            font-size: inherit
</style>
