<template>
    <a class="btn btn-float btn-sm btn-secondary" v-on:click="queue">
        <i class="material-icons">playlist_add</i>
    </a>
</template>
<script>
  export default {
    name: 'queue-album-btn',
    props: ['album'],
    methods: {
      queue: function (event) {
        if (event) event.preventDefault()
        this.$store.dispatch('playlist/queueAlbum', this.album)
      }
    },
  }
</script>
