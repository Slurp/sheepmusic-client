import Model from './AbstractModel'

export default class AlbumModel extends Model {
  constructor(args) {
    const {
      artist,
      artistId,
      name,
      cover,
      playCount,
      length,
      fmtLength,
      songs
    } = args
    super(args)
    Object.assign(this, { artist, artistId, name, cover, playCount, length, fmtLength, songs })
  }

  update(args) {
    this.fullyLoaded = true
    Object.assign(this, args)
    return this
  }
}
