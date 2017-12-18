<template>
    <div class="song-list">
        <div class="song-list-header">
            <div class="col col-track">#</div>
            <div class="col col-title">title</div>
            <!--<div class="col col-artist">artist</div>-->
            <div class="col col-duration"><i class="material-icons">av_timer</i></div>
            <div class="col col-playcount"><i class="material-icons">music_note</i></div>
            <div class="col col-queue"></div>
        </div>
        <div class="song-list-item" v-for="song in songs" v-bind:class="{ playing: isActive(song.id) }">
            <div class="col col-track action">
                <span class="track-number">
                    {{ song.track }}
                </span>

                <a class=""
                   data-play_song=""
                >
                    <i class="material-icons">play_arrow</i>
                </a>
            </div>
            <div class="col col-title">{{ song.title }}</div>
            <!--<div class="col col-artist">{{ song.artist.name }}</div>-->
            <div class="col col-duration">{{ formatLength(song.length) }}</div>
            <div class="col col-playcount">{{ song.playCount }}</div>
            <a class="col col-queue">
                <i class="material-icons">add_to_queue</i>
            </a>
        </div>
    </div>
</template>
<script>
  import { secondsToHis } from 'services/time'

  export default {
    props: ['songs'],
    methods: {
      formatLength(length) {
        return secondsToHis(length)
      },
      isActive (id) {
        if (this.playing && this.currentSong !== null) {
          return (this.currentSong.id === id)
        }
        return false
      }
    },
    computed: {
      playing () {
        return this.$store.getters['playlist/isPlaying']
      },
      currentSong () {
        return this.$store.getters['playlist/getCurrentSong']
      }
    }
  }
</script>
<style>

</style>
