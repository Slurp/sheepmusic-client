<template>
    <router-link :to="detailLink"
                 class="card card__overview">
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
        <div class="progress" v-if="!loaded">
            <div class="progress-bar progress-bar-indeterminate bg-dark" role="progressbar"></div>
        </div>
        <div class="card-block" v-else>
            <h4 class="card-title">{{playlist.name}}</h4>
            <h6 class="card-subtitle text-muted">
                {{playlist.songs.length}} songs
                <span v-if="playlistDuration">
                    <i class="material-icons">av_timer</i>
                    {{ playlistDuration }}
                </span>
            </h6>
        </div>
    </router-link>
</template>

<script>
  import config from 'config/index'
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'
  import { secondsToHis } from 'services/time'

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
        loaded: false,
      }
    },
    created () {
      this.$store.dispatch('playlists/loadPlaylist', this.playlistId).then(() => {
        this.loaded = true
      }).catch((err) => {
        console.log(err)
        this.loaded = false
      })
    },
    methods: {
      toggleSheet () {
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
          params: { id: this.playlistId },
        }
      },
      playlistDuration () {
        if (this.loaded && this.playlist) {
          return secondsToHis(this.playlist.songs.map(song => song.length).reduce((acc, val) => parseInt(acc) + parseInt(val), 0))
        }
        return null
      },
    },

  }
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
