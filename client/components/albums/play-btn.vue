<template>
    <a class="btn-floating" v-on:click="play">
        <i class="material-icons">play_arrow</i>
    </a>
</template>
<script>
  export default {
    name: 'play-album-btn',
    props: ['album'],
    methods: {
      play: function (event) {
        if (event) event.preventDefault()
        this.$store.dispatch('playlist/playAlbum', this.album)
      }
    },
  }
</script>