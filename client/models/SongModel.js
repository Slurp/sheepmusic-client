import Model from './AbstractModel'

export default class SongModel extends Model {
  constructor({ ...args }) {
    super(args.id)
    const {
      albumId = 0,
      title = '',
      length = 0,
      fmtLength = '00:00',
      playCount = 0,
      playbackState = 'stopped'
    } = args
  }
}
