<template>
    <div class="album-detail" :id="album.id" v-if="album && album.songs">
        <breadcrumbs :album="album"></breadcrumbs>
        <div class="album-backdrop backdrop" v-bind:style="{ 'background-image': 'url(' + album.cover + ')' }">
            <div class="info-bar album media">
                <img class="info-bar-image" :src="album.cover"/>
                <div class="info-bar-content media-body">
                    <h1 class="album-name">{{ album.name }}</h1>
                    <h3 class="artist-name">
                        <router-link
                                :to="{ name: 'detail_artist', params: { artist: album.artist.name, id: album.artist.id }}">
                            {{album.artist.name}}
                        </router-link>
                    </h3>
                    <play_btn :album=album></play_btn>
                    <queue_btn :album=album></queue_btn>
                </div>
            </div>
        </div>
        <song-list :songs="album.songs"></song-list>
    </div>
</template>

<script>
  import songList from 'components/songs/list'
  import breadcrumbs from 'components/misc/breadcrumbs'
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'

  export default {
    components: {
      songList,
      breadcrumbs,
      play_btn,
      queue_btn
    },
    props: ['id'],
    created: function () {
      this.$store.dispatch('albums/loadAlbum', this.id)
      this.$store.dispatch('albums/viewAlbum', this.id)
    },
    computed: {
      album () {
        return this.$store.getters['albums/getAlbumById'](this.id)
      }
    },
  }
</script>
<style>

</style>
