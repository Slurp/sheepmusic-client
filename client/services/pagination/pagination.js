const template = require('./template.js')

module.exports =
  {
    render: template(),
    props: {
      for: {
        type: String,
        required: false
      },
      records: {
        type: Number,
        required: true
      },
      perPage: {
        type: Number,
        required: false,
        default: 25
      },
      chunk: {
        type: Number,
        required: false,
        default: 10
      },
      countText: {
        type: String,
        required: false,
        default: 'Showing {from} to {to} of {count} records|{count} records|One record'
      },
      vuex: {
        type: Boolean
      },
      format: {
        type: Boolean,
        default: true
      }
    },
    created: function () {

      if (!this.vuex) return

      if (!this.for) {
        throw new Error('vue-pagination-2: The "for" prop is required when using vuex')
      }
    },
    data: function () {
      return {
        Page: 1
      }
    },
    computed: {
      page: function page () {
        return this.$store.state[this.for].page
      },
      pages: function () {
        if (!this.records) {
          return []
        }
        return range(this.paginationStart, this.pagesInCurrentChunk)
      },
      totalPages: function () {
        return this.records ? Math.ceil(this.records / this.perPage) : 1
      },
      totalChunks: function () {
        return Math.ceil(this.totalPages / this.chunk)
      },
      currentChunk: function () {
        return Math.ceil(this.page / this.chunk)
      },
      paginationStart: function () {
        return ((this.currentChunk - 1) * this.chunk) + 1
      },
      pagesInCurrentChunk: function () {

        return this.paginationStart + this.chunk <= this.totalPages ? this.chunk : this.totalPages - this.paginationStart + 1

      },
      count: function () {

        const from = ((this.page - 1) * this.perPage) + 1
        const to = this.page == (this.totalPages) ? this.records : from + this.perPage - 1
        const parts = this.countText.split('|')
        const i = Math.min(this.records == 1 ? 2 : this.totalPages == 1 ? 1 : 0, parts.length - 1)

        return parts[i].replace('{count}', this.formatNumber(this.records))
          .replace('{from}', this.formatNumber(from))
          .replace('{to}', this.formatNumber(to))
      }
    },
    methods: {
      setPage: function (page) {
        if (this.allowedPage(page)) {
          this.paginate(page)
        }
      },
      paginate: function paginate (page) {
        this.$store.dispatch(this.for + '/paginate', page)
      },
      next: function () {
        return this.setPage(this.page + 1)
      },
      prev: function () {
        return this.setPage(this.page - 1)
      },
      nextChunk: function () {
        return this.setChunk(1)
      },
      prevChunk: function () {
        return this.setChunk(-1)
      },
      setChunk: function (direction) {
        this.setPage((((this.currentChunk - 1) + direction) * this.chunk) + 1)
      },
      allowedPage: function (page) {
        return page >= 1 && page <= this.totalPages
      },
      allowedChunk: function (direction) {
        return (direction == 1 && this.currentChunk < this.totalChunks)
          || (direction == -1 && this.currentChunk > 1)
      },
      allowedPageClass: function (direction) {
        return this.allowedPage(direction) ? '' : 'disabled'
      },
      allowedChunkClass: function (direction) {
        return this.allowedChunk(direction) ? '' : 'disabled'
      },
      activeClass: function (page) {
        return this.page == page ? 'active' : ''
      },
      formatNumber: function (num) {

        if (!this.format) return num

        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    }
  }

function range (start, count) {
  return Array.apply(0, Array(count))
    .map(function (element, index) {
      return index + start
    })
}
