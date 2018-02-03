import Model from './AbstractModel'

export default class ArtistModel extends Model {
  constructor(args) {
    super(args.id)
    this.name = args.name
    this.image = null
    this.playCount = 0
    this.albums = []
    this.songs = []
  }
}
