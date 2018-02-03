
export default class AbstractModel {
  constructor(args) {
    this.id = args.id
    this.fetched = false
    this.fetching = false
    this.fullyLoaded = false
    this.createdAt = args.createdAt
  }

  update(args) {
    this.fullyLoaded = true
  }
}
