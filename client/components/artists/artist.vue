<template>
    <router-link :to="detailLink"
                 class="card card__overview">
        <div class="card-img">
            <img class="card-img-top"
                 v-lazyload
                 :alt="artist.name"
                 src="/media/general/default.png"
                 :data-src=cover
                 data-err="/media/general/default.png"
            />
            <ul class="action-sheet" v-if="loadedArtist">
                <li>
                    <play_btn :artist=artist></play_btn>
                </li>
                <li>
                    <queue_btn :artist=artist></queue_btn>
                </li>
            </ul>
        </div>

        <div class="card-body has-sheet">

            <div class="card-block" v-if="loadedArtist">
                <h4 class="card-title">{{artist.name}}</h4>
                <h6 class="card-subtitle text-muted"><i class="material-icons">album</i>{{ artist.albums.length }}</h6>
            </div>
            <div class="progress" v-else>
                <div class="progress-bar progress-bar-indeterminate bg-dark" role="progressbar"></div>
            </div>
        </div>
    </router-link>
</template>

<script>
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'
  import Toaster from 'services/toast'
  import config from 'config/index'

  export default {
    name: 'artistList',
    props: ['artist', 'artistId'],
    components: {
      play_btn,
      queue_btn
    },
    data () {
      return {
        openSheet: false,
        toast: new Toaster(),
        loaded: false,
      }
    },
    created () {
      if (!this.artist || (this.artist && this.artist.fullyLoaded === false)) {
        this.$store.dispatch('artists/loadArtist', this.artistId).then(() => {
          this.loaded = true
        }).catch(() => {
          this.toast.toast('Nope, API SAYS NO.')
          this.loaded = false
        })
      } else {
        this.loaded = true
      }
    },
    beforeDestroy () {
      this.toast = null
      delete this.toast
    },
    methods: {
      toggleSheet: function (event) {
        if (event) event.preventDefault()
        this.openSheet = !this.openSheet
      }
    },
    computed: {
      hasCover () {
        return (this.loadedArtist && (this.artist.image || this.artist.albumArt))
      },
      cover () {
        if (this.hasCover) {
          if (this.artist.image && this.artist.image !== '') {
            return new URL(this.artist.image, config.baseUrl)
          }
          if (this.artist.albumArt && this.artist.albumArt !== '') {
            return new URL(this.artist.albumArt, config.baseUrl)
          }
        }
        return config.defaultCover
      },
      loadedArtist () {
        return (this.loaded && (this.artist && this.artist.fullyLoaded))
      },
      detailLink () {
        if (this.loadedArtist) {
          return this.$store.getters['artists/detailLink'](this.artist)
        }
        return '404'
      },
    },

  }
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
