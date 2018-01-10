<template>
    <footer id='mainFooter' class='footer-player'>

        <div class='player'>
            <div class="plyr plyr--audio plyr--ready" v-bind:class="{ 'plyr--playing': playing }">
                <div class="plyr__controls">
                    <div class="plyr__progress" v-on:mouseover="hoverProgress = true"  v-on:mouseout="hoverProgress = false">
                        <label for="seek8558" class="plyr__sr-only">Seek</label>
                        <input id="seek8558" class="plyr__progress--seek" type="range" min="0" max="100" step="0.1"
                               value="0"
                               data-plyr="seek">
                        <progress class="plyr__progress--played" max="100" :value="progress"
                                  role="presentation"></progress>
                        <progress class="plyr__progress--buffer" max="100" value="38.78"><span>38.78</span>% buffered
                        </progress>
                        <span class="plyr__tooltip"
                              v-bind:class="{ 'plyr__tooltip--visible': hoverProgress }"
                              v-bind:style="{ left: progress + '%' }"
                              >{{ position }}</span>
                    </div>
                </div>
            </div>
            <div class="player-row">
                <div class='player-controls'>
                    <div class='row'>
                        <button type='button' class="player__button" v-on:click.stop.prevent="playPrev">
                            <i class='material-icons'>skip_previous</i>
                            <span class='plyr__sr-only'>previous</span>
                        </button>
                        <button type='button' class="player__button player__rewind" v-on:click.stop.prevent="rewind">
                            <i class='material-icons'>fast_rewind</i>
                            <span class='plyr__sr-only'>Rewind {seektime} secs</span>
                        </button>
                        <button type='button' class="player__button" data-plyr='play' v-if="stopped"
                                v-on:click.stop.prevent="play">
                            <i class='material-icons'>play_circle_outline</i>
                            <span class='plyr__sr-only'>Play</span>
                        </button>
                        <button type='button' class="player__button" v-if="playing"
                                v-on:click.stop.prevent="pause">
                            <i class='material-icons'>pause_circle_outline</i>
                            <span class='plyr__sr-only'>Pause</span>
                        </button>
                        <button type='button' class="player__button player__forward" v-on:click.stop.prevent="forward">
                            <i class='material-icons'>fast_forward</i>
                            <span class='plyr__sr-only'>Forward {seektime} secs</span>
                        </button>
                        <button type='button' class="player__button" v-on:click.stop.prevent="playNext">
                            <i class='material-icons'>skip_next</i>
                            <span class='plyr__sr-only'>next</span>
                        </button>
                    </div>
                </div>
                <div class="player-info">

                    <img :src="cover" class='song-image'>
                    <div class="now-playing">
                        <h3 class="title" v-if="song">{{ song.title }}</h3>
                        <p class="meta" v-if="song">
                            <router-link class="artist" :to=detailArtist>{{ song.artist.name }}</router-link>
                            –
                            <router-link class="album" :to=detailAlbum>{{ song.album.name }}</router-link>
                        </p>
                    </div>


                </div>
                <div class="player-desktop-controls">
                    <button class="player__button" type='button' data-plyr='mute'>
                        <i class='material-icons icon--muted' v-if="muted">volume_off</i>
                        <i class='material-icons' v-else>volume_mute</i>
                        <span class='plyr__sr-only'>Toggle Mute</span>
                    </button>
                    <span class="plyr__volume">
                  <label for="volume{id}" class="plyr__sr-only">Volume</label>
                    <input type="range" id="volumeRange" max="10" step="0.1"
                           class="plyr__volume__input"
                           @input="setVolume"
                    >
                </span>
                </div>
            </div>
        </div>
        <a href='#'
           class='btn btn-float btn-sm btn-secondary btn-playlist'
           data-toggle='playlist'
           aria-haspopup='true'
           aria-expanded='false'
           v-on:click.stop.prevent="togglePlaylist">
            <i class='material-icons'>queue_music</i>
        </a>
    </footer>
</template>
<script>
  import BlackSheepPlayer from 'components/BSAudioSuite/player'
  import Toaster from 'services/toast'
  import { secondsToHis } from 'services/time'

  export default {
    name: 'player',
    data () {
      return {
        song: null,
        nextSong: null,
        blackSheepPlayer: null,
        toast: new Toaster(),
        muted: false,
        cover: '/media/general/default.png',
        appTitle: document.title,
        loaded: 0,
        seek: 0,
        duration: 0,
        hoverProgress: false,
      }
    },
    mounted () {
      this.blackSheepPlayer = new BlackSheepPlayer(this)

      this.blackSheepPlayer.on('loaded', (duration) => {
        console.log('loaded')
        this.duration = duration
      })
      /**
       * Listen to 'error' event on the audio player and play the next song if any.
       */
      this.blackSheepPlayer.on('playerror', () => {
        console.log('playerrror')
        this.playNext()
      })
      // /**
      //  * Listen to 'ended' event on the audio player and play the next song in the queue.
      //  */
      this.blackSheepPlayer.on('end', () => {
        console.log('ended')
        this.$store.dispatch('songs/playedSong', this.song)
        this.seek = 0
        this.duration = 0
        this.playNext()
      })
      //
      this.blackSheepPlayer.on('play', () => {
        document.title = `${this.currentSong.title} ♫ sheepMusic`
        Notifications.notifySong(this.song)
        this.$store.dispatch('songs/announceSong', this.song)
      })

      this.blackSheepPlayer.on('playingUpdate', (seek) => {
        this.seek = seek
      })

      /**
       * Attempt to preload the next song.
       */
      // this.blackSheepPlayer.player.on('canplaythrough', e => {
      //   if (!this.nextSong || this.nextSong.preloaded) {
      //
      //     this.nextSong = this.$store.getters['playlist/getPreloadSong']
      //     if (!this.nextSong || this.nextSong.preloaded) {
      //       // Don't preload if
      //       // - there's no next song
      //       // - next song has already been preloaded
      //       return
      //     }
      //     const audio = document.createElement('audio')
      //     audio.setAttribute('src', this.nextSong.src)
      //     audio.setAttribute('preload', 'auto')
      //     audio.load()
      //     this.nextSong.preloaded = true
      //   }
      // })
    },
    computed: {
      playing () {
        return this.$store.getters['playlist/isPlaying']
      },
      stopped () {
        return !this.$store.getters['playlist/isPlaying']
      },
      currentSong () {
        return this.$store.getters['playlist/getCurrentSong']
      },
      playlist () {
        return this.$store.getters['playlist/list']
      },
      repeatMode () {
        return this.repeatStatus = this.$store.getters['playlist/repeatMode']
      },
      detailArtist () {
        if (this.song) {
          return this.$store.getters['artists/detailLink'](this.song.artist)
        }
        return '/'
      },
      detailAlbum () {
        if (this.song) {
          return {
            name: 'detail_album',
            params: { artist: this.song.artist.name, album: this.song.album.name, id: this.song.album.id }
          }
        }
        return '/'
      },
      progress () {
        return (this.duration === 0 ? 0 : this.seek / this.duration) * 100
      },
      position () {
        return secondsToHis(this.seek)
      }
    },
    watch: {
      currentSong (newSong, oldSong) {
        this.nextSong = null
        if (oldSong == null || newSong.id !== oldSong.id) {
          this.song = newSong
        }
        this.cover = 'media/general/default.png'
        if (this.song.album.cover !== null) {
          this.cover = this.song.album.cover
        }
        this.play()
      }
    },
    methods: {
      play () {
        this.$store.dispatch('playlist/setPlayingStatus', true)
        if (this.blackSheepPlayer.isPaused()) {
          this.blackSheepPlayer.resume()
          return
        }
        if (this.song !== null) {
          this.blackSheepPlayer.playSong(this.song)
          return
        }
        if (this.playlist !== null && this.playlist.length > 0) {
          this.playNext(true)
          return
        }
      },
      pause () {
        document.title = `Paused: ♫ sheepMusic`
        this.$store.dispatch('playlist/setPlayingStatus', false)
        this.blackSheepPlayer.pause()
      },
      playPrev () {
        if (this.repeatMode === 'REPEAT_ONE') {
          return this.play()
        }
        this.$store.dispatch('playlist/prevSong')
      },
      playNext () {
        if (this.repeatMode === 'REPEAT_ONE') {
          return this.play()
        }
        this.$store.dispatch('playlist/nextSong')
      },
      forward () {
        this.blackSheepPlayer.forward()
      },
      rewind () {
        this.blackSheepPlayer.rewind()
      },

      togglePlaylist () {
        this.$store.dispatch('togglePlaylist')
      },

      setVolume (e) {
        this.blackSheepPlayer.setVolume(e.target.value)
        this.muted = e.target.value === 0
      },

      mute () {
        this.muted = true
        return this.blackSheepPlayer.mute()
      },
      /**
       * Unmute the volume.
       */
      unmute () {
        this.muted = false
        return this.blackSheepPlayer.unmute()
      },
    }
  }
</script>
