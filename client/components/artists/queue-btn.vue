<template>
    <a class="btn-floating" v-on:click="queue">
        <i class="material-icons">playlist_add</i>
    </a>
</template>
<script>
  export default {
    name: 'queue-artist-btn',
    props: ['artist'],
    methods: {
      queue: function (event) {
        if (event) event.preventDefault()
        for (const album of this.artist.albums) {
          this.$store.dispatch('playlist/queueAlbum', album)
        }
      }
    },
  }
</script>
