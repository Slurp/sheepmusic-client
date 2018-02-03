<template>
    <img :src="cover">
</template>
<script>
  import config from 'config/index'

  export default {

    props: ['id', 'album', 'song'],
    computed: {
      albumId () {
        if(this.id) {
          return this.id;
        }
        if(this.song && this.song.album) {
          return this.song.album.id;
        }
        return null;
      },
      record () {
        if (!this.album && this.albumId) {
          return this.$store.getters['albums/getAlbumById'](this.albumId)
        }
        return this.album
      },
      cover () {
        if (this.record && this.record.cover) {
          const url = new URL(this.record.cover, config.baseUrl);
          return url.href;
        }
        return config.defaultCover
      }
    }

  }
</script>
