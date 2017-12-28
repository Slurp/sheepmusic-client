<template>
    <div class="album-detail" :id="album.id">
        <div v-if="album && album.fullyLoaded">
            <breadcrumbs :album="album"></breadcrumbs>
            <div class="album-backdrop backdrop" v-bind:style="{ 'background-image': 'url(' + album.cover + ')' }">
                <div class="info-bar album media">
                    <img class="info-bar-image" :src="album.cover"/>
                    <div class="info-bar-content media-body">
                        <div class="info-bar-content__header">

                            <h1 class="artist-name">
                                <router-link
                                        :to="{ name: 'detail_artist', params: { artist: this.album.artist.name, id: this.album.artist.id }}">
                                    <span v-if="logo == null">{{this.album.artist.name}}</span>
                                    <img :src="logo" v-if="logo != null">
                                </router-link>
                            </h1>


                            <play_btn :album=album></play_btn>
                            <queue_btn :album=album></queue_btn>
                        </div>
                        <h3 class="album-name">
                            {{ album.name }}
                        </h3>
                        <ul class="info">
                            <li><span>Played:</span>{{ this.album.playCount}} times</li>
                            <li><span>Year:</span>{{ this.album.year}}</li>
                            <li><span>Songs:</span>{{ this.album.songs.length }}</li>
                            <li><span>Duration:</span>{{ lengthAlbum }}</li>
                            <li><span>Genre:</span>{{ this.album.genre.name}}</li>
                        </ul>

                    </div>
                </div>
            </div>
            <song-list :songs="album.songs"></song-list>
        </div>
        <div class="progress-circular progress-circular-secondary" v-else>
            <div class="progress-circular-wrapper">
                <div class="progress-circular-inner">
                    <div class="progress-circular-left">
                        <div class="progress-circular-spinner"></div>
                    </div>
                    <div class="progress-circular-gap"></div>
                    <div class="progress-circular-right">
                        <div class="progress-circular-spinner"></div>
                    </div>
                </div>
            </div>
        </div>
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
        if (typeof this.album !== 'undefined' && this.album.fullyLoaded === true) {
          return this.duration = secondsToHis(this.album.songs.map(song => song.length).reduce((acc, val) => parseInt(acc) + parseInt(val), 0))
        }
      },
      logo () {
        if (this.artist !== null && this.artist.logo !== 'undefined') {
          console.log(this.artist.id)
          return this.$store.getters['artists/getLogoForArtist'](this.artist.id)
        }
        return null
      },
      album () {
        return this.$store.getters['albums/getAlbumById'](this.id)
      },
      artist () {
        if (typeof this.album !== 'undefined' && this.album.fullyLoaded === true) {
          console.log(this.album.artist.id)
          const artist = this.$store.getters['artists/getArtistById'](this.album.artist.id)
          if (typeof artist !== 'undefined' && artist.fullyLoaded === true) {
            return artist
          } else {
            console.log(this.album.artist.id)
            this.$store.dispatch('artists/loadArtist', this.album.artist.id)
            return null
          }
        }
        return null
      },
    },
  }
</script>
<style>

</style>
