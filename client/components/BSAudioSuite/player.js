import { Howl } from 'howler'
import config from 'config/index'

export default class BlackSheepPlayer {
  constructor() {
    this.player = null
    this.nextSong = null
    this.currentSong = null
    this.playlist = null
    this.events = []
    this.seek = 0
    this.duration = 0
  }

  on(eventName, handler) {
    if (!(eventName in this.events)) {
      this.events[eventName] = []
    }
    this.events[eventName].push(handler)
  }

  dispatchEvent(eventName, args) {
    const currentEvents = this.events[eventName]
    if (!currentEvents) return

    for (let i = 0; i < currentEvents.length; i++) {
      if (typeof currentEvents[i] === 'function') {
        currentEvents[i](args)
      }
    }
  }

  createHowl(src) {
    return new Howl({
      type: 'audio',
      title: '-',
      src: [config.baseUrl + src],
      format: ['mp3'],
      html5: true,
      preload: true
    })
  }

  handleAudioResourceError() {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Player] Error while loading audio resource.')
    }
    // Stop the music
    this.stop()
    this.dispatchEvent('playerror')
  }

  seekUpdate() {
    const self = this
    if (self.player !== null) {
      // Fix for howl.seek() returning the howl instance
      if (typeof self.player.seek() !== 'number') {
        self.seek = 0
      } else {
        self.seek = self.player.seek()
      }
      self.dispatchEvent('seekUpdate', self.seek)
      if (self.player.playing()) {
        requestAnimationFrame(self.seekUpdate.bind(self))
      }
    } else {
      self.seek = 0
      self.duration = 0
    }
  }

  /**
   * Preload a song when needed
   * @param song
   */
  preloadSong(song) {
    if (this.nextSong === null) {
      this.nextSong = { id: song.id, player: this.createHowl(song.src) }
      if (process.env.NODE_ENV !== 'production') {
        console.log('preloaded song')
      }
    }
  }

  /**
   * Play a song boy!
   * @param song
   */
  playSong(song) {
    this.stop()
    // Check for preloaded song
    if (this.nextSong && this.nextSong.id === song.id) {
      this.currentSong = this.nextSong.id
      this.player = this.nextSong.player
      if (process.env.NODE_ENV !== 'production') {
        console.log('use preloaded song')
      }
    } else {
      this.currentSong = song.id
      this.player = this.createHowl(song.src)
    }
    // Attach events for the player
    this.player.on('load', () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('song loaded')
      }
      this.duration = this.player.duration()
      this.dispatchEvent('loaded', this.duration)
    })
    this.player.on('play', () => {
      if (this.nextSong && this.nextSong.id === song.id) {
        this.duration = this.player.duration()
        this.dispatchEvent('loaded', this.duration)
      }
      const self = this
      this.dispatchEvent('play')
      requestAnimationFrame(self.seekUpdate.bind(self))
    })
    this.player.on('end', () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('song ended')
      }
      this.stop()
      this.dispatchEvent('end', null)
    })
    this.player.on('loaderror', () => this.handleAudioResourceError())
    this.nextSong = null

    this.restart()
  }

  restart() {
    if (this.player) {
      this.player.seek(0)
      this.player.play()
    }
  }

  pause() {
    if (this.player.playing()) {
      this.player.pause()
    }
  }

  resume() {
    this.player.play()
  }

  isPaused() {
    console.log(this.player)
    return (this.player !== null && !this.player.playing())
  }

  stop() {
    if (this.player) {
      this.player.stop().off().unload()
      this.player = null
      this.currentSong = null
    }
  }

  forward() {
    if (this.player && this.player.playing()) {
      this.player.seek(Math.min(this.player._duration, this.player.seek() + 5))
    }
  }

  rewind() {
    if (this.player && this.player.playing()) {
      this.player.seek(Math.max(0, this.player.seek() - 5))
    }
  }

  setSeekPosition(value) {
    console.log(value)
    if (this.player) {
      this.player.seek(value)
    }
  }

  /**
   * Set the volume level.
   *
   * @param {Number}     volume   0-10
   */
  setVolume(volume) {
    this.player.volume(volume / 10)
  }
}
