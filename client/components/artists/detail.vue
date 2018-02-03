<template>
    <article class="library-detail artist-detail" :id="id">
        <div v-if="artist && artist.fullyLoaded">
            <breadcrumbs :artist="artist"></breadcrumbs>
            <div class="backdrop">
                <div class="image-backdrop artist-backdrop" v-bind:style="{ 'background-image': 'url(' + background + ')' }"></div>
            </div>
            <section>
                <div class="actions">
                    <play_btn :artist=artist></play_btn>
                    <queue_btn :artist=artist></queue_btn>
                    <edit_btn :artist=artist></edit_btn>
                </div>
                <div class="detail-info-wrapper">
                    <div class="detail-art">
                        <img :src="cover">
                    </div>
                    <div class="detail-info">
                        <h1 class="artist-name" v-if="logo == null">{{ artist.name }}</h1>
                        <h1 class="artist-name" v-if="logo != null"><img :src="logo"></h1>
                        <div class="meta">
                            <i class="material-icons">album</i>{{ artist.albums.length }}
                            <i class="material-icons" v-if="genres">receipt</i>{{ genres }}
                        </div>
                        <truncate clamp="..." :length="90" less="Show Less" :text="artist.biography"></truncate>
                    </div>
                </div>
            </section>
            <section class="list">
                <div class="col" v-for="album in albums" :key="album.id">
                    <album :album-id=album.id :album=storedAlbum(album.id) :key="album.id"></album>
                </div>
            </section>
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
    </article>

</template>

<script>
  import songList from 'components/songs/list'
  import breadcrumbs from 'components/misc/breadcrumbs'
  import album from 'components/albums/album'
  import truncate from './bio'
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'
  import edit_btn from './edit-btn'

  export default {
    components: {
      songList,
      breadcrumbs,
      album,
      truncate,
      play_btn,
      queue_btn,
      edit_btn
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
      },
      storedAlbum (albumId) {
        return this.$store.getters['albums/getAlbumById'](albumId)
      },
    },
    computed: {
      genres () {
        return this.artist.genres.reduce(function (prevVal, elem, index, array) {
          console.log(index)
          if(index < 5) {
            if (array.length - 1 > index && index < 4) {
              return prevVal + elem.name + ', '
            }
            return prevVal + elem.name
          }
          return prevVal
        }, '')
      },
      logo () {
        return this.$store.getters['artists/getLogoForArtist'](this.id)
      },
      cover () {
        if (this.$store.getters['artists/getThumbForArtist'](this.id)) {
          return this.$store.getters['artists/getThumbForArtist'](this.id)
        }
        if (this.artist.image && this.artist.image !== '') {
          return this.artist.image
        }
        if (this.artist.albumArt) {
          return this.artist.albumArt
        }

      },
      background () {
        if (this.$store.getters['artists/getBackgroundForArtist'](this.id)) {
          return this.$store.getters['artists/getBackgroundForArtist'](this.id)
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
