<template>
    <div class="artist-detail" :id="artist.id" v-if="artist && artist.albums">
        <breadcrumbs :artist="artist"></breadcrumbs>
        <div class="artist-backdrop backdrop" v-bind:style="{ 'background-image': 'url(' + artist.albumArt + ')' }">
            <div class="info-bar artist media">
                <img class="info-bar-image" :src="cover"/>
                <div class="info-bar-content media-body">
                    <div class="info-bar-content__header">
                        <h1 class="artist-name" v-if="logo == null">{{ artist.name }}</h1>
                        <h1 class="artist-name" v-if="logo != null"><img :src="logo"></h1>
                        <play_btn :artist=artist></play_btn>
                        <queue_btn :artist=artist></queue_btn>
                    </div>
                    <dl class="info">
                        <dt>Albums:</dt>
                        <dd>{{ artist.albums.length }}</dd>
                    </dl>
                    <truncate clamp="..." :length="90" less="Show Less" :text="artist.biography"></truncate>
                </div>
            </div>
        </div>
        <div class="list">
            <div class="col" v-for="album in albums" :key="album.id">
                <album :album-id=album.id :album=album :key="album.id"></album>
            </div>
        </div>
    </div>

</template>

<script>
  import songList from 'components/songs/list'
  import breadcrumbs from 'components/misc/breadcrumbs'
  import album from 'components/albums/album'
  import truncate from './bio'
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'

  export default {
    components: {
      songList,
      breadcrumbs,
      album,
      truncate,
      play_btn,
      queue_btn
    },
    props: ['id'],
    created () {
      this.loadArtistDetail()
    },
    methods: {
      loadArtistDetail () {
        if (this.artist == null || typeof this.artist.albums == 'undefined') {
          this.$store.dispatch('artists/loadArtist', this.id)
        }
        this.$store.dispatch('artists/viewArtist', this.id)

      }
    },
    computed: {
      logo () {
        return this.$store.getters['artists/getLogoForArtist'](this.id)
      },
      cover () {
        if (this.artist.image !== '') {
          return this.artist.image
        }
        return this.artist.albumArt

      },
      artist () {
        return this.$store.getters['artists/getArtistById'](this.id)
      },
      albums () {
        if (this.artist.albums !== 'undefined') {
          return this.artist.albums.sort((a, b) => b.year - a.year)
        }
      }
    },
  }
</script>
<style>

</style>
