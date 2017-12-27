<template>
    <div class="album-detail" :id="album.id" v-if="album && album.songs">
        <breadcrumbs :album="album"></breadcrumbs>
        <div class="album-backdrop backdrop" v-bind:style="{ 'background-image': 'url(' + album.cover + ')' }">
            <div class="info-bar album media">
                <img class="info-bar-image" :src="album.cover"/>
                <div class="info-bar-content media-body">
                    <div class="info-bar-content__header">
                        <router-link
                                :to="{ name: 'detail_artist', params: { artist: album.artist.name, id: album.artist.id }}">
                            <h1 class="artist-name">
                                <span v-if="logo == null">{{album.artist.name}}</span>
                                <img :src="logo" v-if="logo != null">
                            </h1>
                        </router-link>

                        <play_btn :album=album></play_btn>
                        <queue_btn :album=album></queue_btn>
                    </div>
                    <h3 class="album-name">
                        {{ album.name }}
                    </h3>
                    <ul class="info">
                        <li><span>Year:</span>{{ this.album.year}}</li>
                        <li><span>Songs:</span>{{ this.album.songs.length }}</li>
                        <li><span>Duration:</span>{{ lengthAlbum }}</li>
                    </ul>

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
  import { secondsToHis } from 'services/time'

  export default {
    name: 'album_details',
    components: {
      songList,
      breadcrumbs,
      play_btn,
      queue_btn
    },
    props: ['id'],
    data () {
      return {
        duration: ''
      }
    },
    created: function () {
      if (this.album == null || typeof this.album.songs == 'undefined') {
        this.$store.dispatch('albums/loadAlbum', this.id)
      }
      this.$store.dispatch('albums/viewAlbum', this.id)
    },
    computed: {
      lengthAlbum () {
        if (this.album.songs) {
          return this.duration = secondsToHis(this.album.songs.map(song => song.length).reduce((acc, val) => parseInt(acc) + parseInt(val), 0))
        }
      },
      logo() {
         if(this.album.artist) {
           return this.$store.getters['artists/getLogoForArtist'](this.album.artist.id)
         }
        return null
      },
      album () {
        return this.$store.getters['albums/getAlbumById'](this.id)
      }
    },
  }
</script>
<style>

</style>
