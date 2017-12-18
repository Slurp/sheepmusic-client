<template>
    <router-link :to="detailLink"
                 class="card">
        <img class="card-img-top" v-if="hasCover" :src="cover" :alt="playlist.name"/>
        <img class="card-img-top" v-else src="/media/general/default.png"/>
        <div class="card-body has-sheet">
            <div class="fixed-action-btn"
                 :class="{ active: openSheet }"
                 v-on:click.stop.prevent="toggleSheet">
                <a class="btn btn-float btn-sm btn-secondary">
                    <i class="material-icons">more_horiz</i>
                </a>
                <ul class="action-sheet">
                    <li>
                        <play_btn :playlist=playlist></play_btn>
                    </li>
                    <li>
                        <queue_btn :playlist=playlist></queue_btn>
                    </li>
                </ul>
            </div>
        </div>
        <div class="card-block">
            <h4 class="card-title">{{playlist.name}}</h4>
        </div>
    </router-link>
</template>

<script>
  import config from 'config/index'
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'
  import Toaster from 'services/toast'

  export default {
    name: 'playlistList',
    props: ['playlist', 'playlistId'],
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
      this.$store.dispatch('playlists/loadPlaylist', this.playlist.id).then(() => {
        this.toast.toast('loaded artist')
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
        return (this.loaded && (this.playlist.cover))
      },
      cover () {
        if (this.hasCover) {
          return config.baseUrl+"/"+this.playlist.cover
        }
      },
      detailLink () {
        return {
          name: 'detail_playlists',
          params: { id: this.playlist.id },
        }
      },
    },

  }
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
