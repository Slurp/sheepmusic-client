import { Howl } from 'howler'
import config from 'config/index'

export default class BlackSheepPlayer {

  constructor () {
    this.player = null
    this.nextSong = null
    this.currentSong = null
    this.playlist = null
    this.events = []
    this.seek = 0
    this.duration = 0
  }

  on (eventName, handler) {
    if (!(eventName in this.events)) {
      this.events[eventName] = []
    }
    this.events[eventName].push(handler)
  }

  raiseEvent (eventName, args) {
    const currentEvents = this.events[eventName]
    if (!currentEvents) return

    for (let i = 0; i < currentEvents.length; i++) {
      if (typeof currentEvents[i] === 'function') {
        currentEvents[i](args)
      }
    }
  }

  updateAudioElement (src) {
    if (this.player) {
      this.stop()
    }
    const self = this
    this.player = new Howl({
      type: 'audio',
      title: '-',
      src: [config.baseUrl + src],
      format: ['mp3'],
      html5: true,
      onend: () => {
        this.stop()
        this.raiseEvent('end', null)
      },
      onload: () => {
        this.duration = this.player.duration()
        this.raiseEvent('loaded', this.duration)
      },
      onloaderror: () => this.handleAudioResourceError(),
      onplay: () => {
        requestAnimationFrame(self.seekUpdate.bind(self))
        this.raiseEvent('play')
      }
    })
  }

  handleAudioResourceError () {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Player] Error while loading audio resource.')
    }
    // Stop the music
    this.stop()
    this.raiseEvent('playerror', null)
  }

  seekUpdate () {
    var self = this
    if (self.player !== null) {
      // Fix for howl.seek() returning the howl instance
      if (typeof self.player.seek() !== 'number') {
        self.seek = 0
      } else {
        self.seek = self.player.seek()
      }
      self.raiseEvent('seekUpdate', self.seek)
      if (self.player.playing()) {
        requestAnimationFrame(self.seekUpdate.bind(self))
      }
    } else {
      self.seek = 0
      self.duration = 0
    }
  }

  // give notice that we ended
  onEnded () {

  }

  playSong (song) {
    this.nextSong = null
    this.currentSong = song
    this.updateAudioElement(this.currentSong.src)
    this.restart()
  }

  restart () {
    if (this.player) {
      this.player.seek(0)
      this.player.play()
    }
  }

  pause () {
    if (this.player.playing()) {
      this.player.pause()
    }
  }

  resume () {
    this.player.play()
  }

  isPaused () {
    console.log(this.player)
    return (this.player !== null && !this.player.playing())
  }

  stop () {
    if (this.player) {
      this.nextSong = null
      this.player.stop()
      this.player = null
    }
  }

  forward () {
    if (this.player && this.player.playing()) {
      console.log(Math.min(this.player._duration, this.player.seek() + 5))
      this.player.seek(Math.min(this.player._duration, this.player.seek() + 5))
    }
  }

  rewind () {
    if (this.player && this.player.playing()) {
      console.log(Math.min(0, this.player.seek() - 5))
      this.player.seek(Math.max(0, this.player.seek() - 5))
    }
  }

  setSeekPosition (value) {
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
  setVolume (volume) {
    this.player.volume(volume / 10)
  }

}
