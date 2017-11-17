<template>
    <router-link :to="detailLink"
                 class="card" v-if="loaded">

        <img class="card-img-top" v-if="hasCover" :src="album.cover" :alt="album.name"/>
        <img class="card-img-top" v-else src="/media/general/default.png"/>
        </div>
        <div class="card-body has-sheet">
            <div class="fixed-action-btn"
                 :class="{ active: openSheet }"
                 v-on:click="toggleSheet"
                 v-if="loadedAlbum">
                <a class="btn btn-floating">
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
        <div class="card-block">
            <h4 class="card-title" v-if="loadedAlbum">{{album.artist.name}}</h4>
            <h6 class="card-subtitle text-muted" v-if="loadedAlbum">{{album.name}}</h6>
        </div>
    </router-link>
</template>

<script>
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'
  import Toaster from 'services/toast'

  export default {
    name: 'albumList',
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
      this.$store.dispatch('albums/loadAlbum', this.albumId).then(() => {
        this.toast.toast('loaded album')
        this.loaded = true
      }).catch(() => {
        this.toast.toast('@#@#*(&@#*&@#(*!@^!@&@!')
        this.loaded = false
      })
    },
    methods: {
      toggleSheet: function (event) {
        if (event) event.preventDefault()
        this.openSheet = !this.openSheet
      }
    },
    computed: {
      hasCover () {
        return (this.loaded && this.album.cover)
      },
      loadedAlbum () {
        return (this.loaded && this.album.artist)
      },
      detailLink () {
        if (this.loadedAlbum) {
          return {
            name: 'detail_album',
            params: { artist: this.album.artist.name, album: this.album.name, id: this.album.id },
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
