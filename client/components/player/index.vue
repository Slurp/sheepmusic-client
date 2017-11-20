<template>
    <footer id='mainFooter' class='footer-player'>
        <div class='player'>
                <div class='player-controls'>
                    <div class='row'>
                        <button type='button' v-on:click.stop.prevent="playPrev">
                            <i class='material-icons'>skip_previous</i>
                            <span class='plyr__sr-only'>previous</span>
                        </button>
                        <button type='button' data-plyr='rewind'>
                            <i class='material-icons'>fast_rewind</i>
                            <span class='plyr__sr-only'>Rewind {seektime} secs</span>
                        </button>
                        <button type='button' data-plyr='play' v-if="stopped" v-on:click.stop.prevent="play">
                            <i class='material-icons'>play_circle_outline</i>
                            <span class='plyr__sr-only'>Play</span>
                        </button>
                        <button type='button' data-plyr='pause' v-if="playing" v-on:click.stop.prevent="pause">
                            <i class='material-icons'>pause_circle_outline</i>
                            <span class='plyr__sr-only'>Pause</span>
                        </button>
                        <button type='button' data-plyr='fast-forward'>
                            <i class='material-icons'>fast_forward</i>
                            <span class='plyr__sr-only'>Forward {seektime} secs</span>
                        </button>
                        <button type='button' v-on:click.stop.prevent="playNext">
                            <i class='material-icons'>skip_next</i>
                            <span class='plyr__sr-only'>next</span>
                        </button>
                    </div>
                </div>
                <audio controls preload></audio>
                <div class="player-info">
                    <button type='button' data-plyr='mute'>
                    <i class='material-icons icon--muted'>volume_off</i>
                    <i class='material-icons'>volume_mute</i>
                    <span class='plyr__sr-only'>Toggle Mute</span>
                    </button>'
                </div>
        </div>
        <a href='#'
           class='btn btn-float btn-sm btn-secondary btn-playlist'
           data-toggle='playlist'
           aria-haspopup='true'
           aria-expanded='false'>
            <i class='material-icons'>queue_music</i>
        </a>
    </footer>
</template>
<script>
  import plyr from 'plyr'
  import BlackSheepPlayer from 'components/BSAudioSuite/player'
  import Notifications from 'services/notifications'
  import Toaster from 'services/toast'

  export default {
    name: 'player',
    data() {
      return {
        song: null,
        nextSong: null,
        blackSheepPlayer: null,
        toast: new Toaster()
      }
    },
    mounted() {
      this.blackSheepPlayer = new BlackSheepPlayer()
      /**
       * Listen to 'error' event on the audio player and play the next song if any.
       */
      this.blackSheepPlayer.player.on('error', () => this.playNext(), true)
      /**
       * Listen to 'ended' event on the audio player and play the next song in the queue.
       */
      this.blackSheepPlayer.player.on('ended', () => {
        this.$store.dispatch('songs/playedSong',this.song)
        this.playNext()
      })

      this.blackSheepPlayer.player.on('play', () => {
        Notifications.notifySong(this.song)
        this.$store.dispatch('songs/announceSong',this.song)
      })

      /**
       * Attempt to preload the next song.
       */
      this.blackSheepPlayer.player.on('canplaythrough', e => {
        if (!this.nextSong || this.nextSong.preloaded) {

            this.nextSong = this.$store.getters['playlist/getPreloadSong']
            if (!this.nextSong || this.nextSong.preloaded) {
              // Don't preload if
              // - there's no next song
              // - next song has already been preloaded
              return
            }
            const audio = document.createElement('audio')
            audio.setAttribute('src', this.nextSong.src)
            audio.setAttribute('preload', 'auto')
            audio.load()
            this.nextSong.preloaded = true
        }
      })
    },
    computed: {
      playing() {
        return this.$store.getters['playlist/isPlaying'];
      },
      stopped() {
        return !this.$store.getters['playlist/isPlaying'];
      },
      currentSong() {
        return this.$store.getters['playlist/getCurrentSong']
      },
      playlist() {
        return this.$store.getters['playlist/list'];
      }
    },
    watch: {
      currentSong(newSong, oldSong) {
        this.nextSong = null;
        this.song = newSong
        this.play()
      }
    },
    methods: {
      play: function (event) {
        if(this.blackSheepPlayer.isPaused()) {
          this.blackSheepPlayer.resume()
        } else {
          if (this.song !== null) {
            this.blackSheepPlayer.playSong(this.song)
            this.$store.dispatch('playlist/setPlayingStatus', true)
          } else {
            if (this.playlist !== null && this.playlist.length > 0) {
              this.playNext(true)
            }
          }
        }
      },
      pause: function (event) {
        this.$store.dispatch('playlist/setPlayingStatus', false)
        this.blackSheepPlayer.pause()
      },
      playPrev: function (event) {
        this.$store.dispatch('playlist/prevSong')
      },
      playNext: function (event) {
        this.$store.dispatch('playlist/nextSong')
      },
      forward: function (event) {

      },
      rewind: function (event) {

      },
    }
  }
</script>
