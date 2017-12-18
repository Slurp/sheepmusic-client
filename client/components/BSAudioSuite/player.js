import jQuery from 'jquery'
import plyr from 'plyr'
import config from 'config/index'

export default class BlackSheepPlayer {

  constructor () {
    this.initialized = false
    this.player = null
    this.nextSong = null
    this.currentSong = null
    this.playlist = null
    this.init()
  }

  /**
   * Init the module
   */
  init () {
    // We don't need to init this service twice, or the media events will be duplicated.
    if (this.initialized) {
      return
    }

    this.player = plyr.setup(
      {
        controls: ['progress'],
        loadSprite: false,
        debug: false
      }
    )[0]
    this.initialized = true
  };

  updateAudioElement (src) {
    this.player.source({
      type: 'audio',
      title: '-',
      sources: [{
        src: config.baseUrl + src,
        type: 'audio/mp3'
      }]
    })
  };

  playSong (song) {
    this.nextSong = null
    this.currentSong = song
    this.updateAudioElement(this.currentSong.src)
    jQuery('.plyr audio').attr('title', `${this.currentSong.artist.name} - ${this.currentSong.title}`)
    this.restart()
  };

  restart () {
    this.player.restart(0)
    this.player.play()
  };

  pause () {
    this.player.pause()
  };

  resume () {
    this.player.play()
  };

  isPaused () {
    this.player.isPaused()
  };

  stop () {
    this.nextSong = null
    this.player.stop()
  };

  forward () {
    this.player.forward()
  };

  rewind () {
    this.player.rewind()
  };

  /**
   * Set the volume level.
   *
   * @param {Number}     volume   0-10
   */
  setVolume (volume) {
    this.player.setVolume(volume)
  };
}
