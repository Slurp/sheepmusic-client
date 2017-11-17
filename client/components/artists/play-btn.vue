<template>
    <a class="btn-floating" v-on:click="play">
        <i class="material-icons">play_arrow</i>
    </a>
</template>
<script>
  export default {
    name: 'play-artist-btn',
    props: ['artist'],
    methods: {
      play: function (event) {
        if (event) event.preventDefault()
        this.$store.dispatch('playlist/clearPlaylist')
        for (const album of this.artist.albums) {
          this.$store.dispatch('playlist/queueAlbum', album)
        }
        this.$store.dispatch('playlist/nextSong')
      }
    },
  }
</script>
