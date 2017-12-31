<template>

    <router-link :to="detailLink"
                 class="card card__overview">
        <img class="card-img-top" v-if="hasCover" :src="album.cover" :alt="album.name"/>
        <img class="card-img-top" v-else src="/media/general/default.png"/>

        <div class="card-body has-sheet">
            <div class="fixed-action-btn"
                 v-bind:class="{ active: openSheet }">
                <a class="btn btn-float btn-sm btn-secondary" v-on:click.stop.prevent="toggleSheet"
                   v-if="loadedAlbum">
                    <i class="material-icons">more_horiz</i>
                </a>
                <ul class="action-sheet">
                    <li>
                        <play_btn :album=album></play_btn>
                    </li>
                    <li>
                        <queue_btn :album=album></queue_btn>
                    </li>
                </ul>
            </div>
        </div>
        <div class="progress" v-if="!loadedAlbum">
            <div class="progress-bar progress-bar-indeterminate bg-dark" role="progressbar"></div>
        </div>
        <div class="card-block" v-if="loadedAlbum">
            <h4 class="card-title">{{album.artist.name}}</h4>
            <h6 class="card-subtitle text-muted">{{album.name}}</h6>
        </div>
    </router-link>
</template>

<script>
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'
  import Toaster from 'services/toast'

  export default {
    props: ['album', 'albumId'],
    components: {
      play_btn,
      queue_btn
    },
    data () {
      return {
        openSheet: false,
        toast: new Toaster(),
        loaded: false
      }
    },
    created () {
      this.getAlbumDetails()
    },
    beforeDestroy () {
      this.toast = null
      delete this.toast
      delete this.openSheet
      delete this.loaded
    },
    methods: {
      getAlbumDetails () {
        if (this.album == null || this.album.fullyLoaded == false) {
          this.loaded = false
          this.$store.dispatch('albums/loadAlbum', this.albumId).then(() => {
            this.loaded = true
          }).catch(() => {
            this.toast.toast(`Stop! ${this.album.name} got hammered and is not getting of the server`)
            this.loaded = false
          })
        }
        this.loaded = true
      },
      toggleSheet () {
        this.openSheet = !this.openSheet
      }
    },
    computed: {
      hasCover () {
        return (this.loaded && this.album.cover)
      },
      loadedAlbum () {
        return this.album.fullyLoaded
      },
      detailLink () {
        if (this.album && this.album.fullyLoaded) {
          return {
            name: 'detail_album',
            params: { artist: this.album.artist.name, album: this.album.slug, id: this.album.id },
          }
        }
        return '/'
      },
    },

  }
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
