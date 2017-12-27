<template>
    <div class="album-detail" :id="playlist.id" v-if="playlist && playlist.songs">
        <breadcrumbs></breadcrumbs>
        <div class="album-backdrop backdrop" v-bind:style="{ 'background-image': 'url(' + cover + ')' }">
            <div class="info-bar album media">
                <img class="info-bar-image" :src="cover"/>
                <div class="info-bar-content media-body">
                    <div class="info-bar-content__header">
                        <h1 class="album-name">{{ playlist.name }}</h1>
                        <play_btn :playlist=playlist></play_btn>
                        <queue_btn :playlist=playlist></queue_btn>
                    </div>
                </div>
            </div>
        </div>
        <song-list :songs="playlist.songs"></song-list>
    </div>
</template>

<script>
  import config from 'config/index'
  import songList from 'components/songs/list'
  import breadcrumbs from 'components/misc/breadcrumbs'
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'

  export default {
    name: 'playlist-detail',
    components: {
      songList,
      breadcrumbs,
      play_btn,
      queue_btn
    },
    props: ['id'],
    created: function () {
      this.$store.dispatch('playlists/loadPlaylist', this.id)
      this.$store.dispatch('playlists/viewPlaylist', this.id)
    },
    computed: {
      cover () {
        if (this.playlist.cover) {
          return config.baseUrl + '/' + this.playlist.cover
        }
      },
      playlist () {
        return this.$store.getters['playlists/getPlaylistById'](this.id)
      }
    },
  }
</script>
<style>

</style>
