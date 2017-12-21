<template>
    <router-link :to="detailLink"
                 class="card card__overview">

        <img class="card-img-top" v-if="hasCover" :src="cover" :alt="artist.name"/>
        <img class="card-img-top" v-else src="/media/general/default.png"/>
        </div>
        <div class="card-body has-sheet">
            <div class="fixed-action-btn"
                 :class="{ active: openSheet }"
                 v-on:click.stop.prevent="toggleSheet"
                 v-if="loadedArtist">
                <a class="btn btn-float btn-sm btn-secondary">
                    <i class="material-icons">more_horiz</i>
                </a>
                <ul class="action-sheet">
                    <li>
                        <play_btn :artist=artist></play_btn>
                    </li>
                    <li>
                        <queue_btn :artist=artist></queue_btn>
                    </li>
                </ul>
            </div>
        </div>
        <div class="progress" v-if="!loadedArtist">
            <div class="progress-bar progress-bar-indeterminate bg-dark" role="progressbar"></div>
        </div>
        <div class="card-block" v-if="loadedArtist">
            <h4 class="card-title">{{artist.name}}</h4>
            <h6 class="card-subtitle text-muted">{{artist.name}}</h6>
        </div>
    </router-link>
</template>

<script>
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'
  import Toaster from 'services/toast'

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
      if (this.artist == null || typeof this.artist.albums == 'undefined') {
        this.$store.dispatch('artists/loadArtist', this.artistId).then(() => {
          this.toast.toast('loaded artist')
          this.loaded = true
        }).catch(() => {
          this.toast.toast('@#@#*(&@#*&@#(*!@^!@&@!')
          this.loaded = false
        })
      } else {
        this.loaded = true
      }
    },
    beforeDestroy() {
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
        return (this.loaded && (this.artist.image || this.artist.albumArt))
      },
      cover () {
        if (this.hasCover) {
          if (this.artist.image !== '') {
            return this.artist.image
          }
          return this.artist.albumArt
        }
      },
      loadedArtist () {
        return (this.loaded && this.artist.albums)
      },
      detailLink () {
        return  this.$store.getters['artists/detailLink'](this.artist)
      },
    },

  }
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
