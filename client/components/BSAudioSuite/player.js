import jQuery from 'jquery'
import plyr from 'plyr'
import config from 'config/index'

export default class BlackSheepPlayer {

  constructor () {
    this.initialized = false
    this.player = null
    this.repeatModes = ['NO_REPEAT', 'REPEAT_ALL', 'REPEAT_ONE']
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

    const controls = [
      '<div class=\'player-info\'>',
      '<img src=\'/frontend/img/default.png\' class=\'song-image\'/>',

      '<span class=\'plyr__progress progress-wrapper\'>',
      '<label for=\'seek{id}\' class=\'plyr__sr-only\'>Seek</label>',
      '<input id=\'seek{id}\' class=\'plyr__progress--seek\' type=\'range\' min=\'0\' max=\'100\' step=\'0.1\' value=\'0\' data-plyr=\'seek\'>',
      '<progress class=\'plyr__progress--played\' max=\'100\' value=\'0\' role=\'presentation\'></progress>',
      '<progress class=\'plyr__progress--buffer\' max=\'100\' value=\'0\'>',
      '<span>0</span>% buffered',
      '</progress>',
      '<span class=\'plyr__tooltip\'>00:00</span>',
      '</span>',
      '<div id=\'now-playing\' href=\'#albums\'>',
      '<a href=\'#\' class=\'playing-song-title\'>',
      'Nothing Playing',
      '</a>',
      '<a href=\'#\' class=\'playing-song-artist\'>',
      '</a>',
      '<span class=\'playing-song-meta\'></span>',
      '<canvas width=\'453\' height=\'66\' id=\'showcase\'></canvas>',
      '</div>',
      '<button type=\'button\' data-plyr=\'restart\'>',
      '<i class=\'material-icons\'>replay</i>',
      '<span class=\'plyr__sr-only\'>Restart</span>',
      '</button>',
      '</div>',
      '<div class=\'player-extra player-controls plyr__controls\'>',
      '<span class=\'plyr__volume\'>',
      '<label for=\'volume{id}\' class=\'plyr__sr-only\'>Volume</label>',
      '<input id=\'volume{id}\' class=\'plyr__volume--input\' type=\'range\' min=\'0\' max=\'10\' value=\'5\' data-plyr=\'volume\'>',
      '<progress class=\'plyr__volume--display\' max=\'10\' value=\'0\' role=\'presentation\'></progress>',
      '</span>',
      '</div>'].join('')

    this.player = plyr.setup(
      {
        html: controls,
        controle: ['progress', 'current-time'],
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
    jQuery('title').text(`${this.currentSong.title} ♫ sheepMusic`)
    jQuery('.plyr audio').attr('title', `${this.currentSong.artist.name} - ${this.currentSong.title}`)
    jQuery('.player .playing-song-title').text(`${this.currentSong.title}`)
    jQuery('.player .playing-song-artist').text(`${this.currentSong.artist.name}`)
    jQuery('.player .song-image').attr('src', this.currentSong.album.cover)
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
  }
}
