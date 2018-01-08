import { Howl } from 'howler'
import config from 'config/index'

export default class BlackSheepPlayer {

  constructor () {
    this.player = null
    this.nextSong = null
    this.currentSong = null
    this.playlist = null
  }

  updateAudioElement (src) {
    if (this.player) {
      this.stop()
    }
    this.player = new Howl({
      type: 'audio',
      title: '-',
      src: [config.baseUrl + src],
      format: ['mp3'],
      html5: true,
      onend: this.onEnded,
      onload: () => {
        this.duration = this.player.duration()
      }
      // onloaderror: () => this.handleAudioResourceError(),
      // onplay: () => requestAnimationFrame(this.updateSeek),
    })
  };

  onEnded () {
    this.dispatchEvent(new Event('end'))
  }

  playSong (song) {
    this.nextSong = null
    this.currentSong = song
    this.updateAudioElement(this.currentSong.src)
    this.restart()
  };

  restart () {
    if (this.player) {
      this.player.seek(0)
      this.player.play()
    }
  };

  pause () {
    if (this.player.playing()) {
      this.player.pause()
    }
  };

  resume () {
    this.player.play()
  };

  isPaused () {
    console.log(this.player)
    return (this.player !== null && !this.player.playing())
  };

  stop () {
    if (this.player) {
      this.nextSong = null
      this.player.stop()
      this.player = null
    }
  };

  forward () {
    if (this.player && this.player.playing()) {
      console.log(Math.min(this.player._duration, this.player.seek() + 5))
      this.player.seek(Math.max(this.player._duration, this.player.seek() + 5))
    }
  };

  rewind () {
    if (this.player && this.player.playing()) {
      console.log(Math.min(0, this.player.seek() - 5))
      this.player.seek(Math.min(0, this.player.seek() - 5))
    }
  };

  /**
   * Set the volume level.
   *
   * @param {Number}     volume   0-10
   */
  setVolume (volume) {
    this.player.volume(volume / 10)
  };
}
