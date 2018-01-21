'use strict'
import * as Push from 'push.js'

export default class Notification {
  static notifySong(song) {
    Push.clear()
    const promise = Push.create(`♫ ${song.title}`, {
      body: `${song.album.name} – ${song.artist.name}`,
      icon: `${song.album.cover}`,
      timeout: 300
    })

    promise.then(notification => {
      notification.close()
    })
  }
}
