'use strict'

module.exports = function () {
  return function (h) {

    var items = []

    this.pages.map(function (page) {
      items.push(h(
        'li',
        { 'class': 'page-item ' + this.activeClass(page) },
        [h(
          'a',
          {
            'class': 'page-link', attrs: {
            role: 'button'
          },
            on: {
              click: this.setPage.bind(this, page)
            }
          },
          [page]
        )]
      ))
    }.bind(this))

    return h(
      'div',
      { 'class': 'VuePagination' },
      [h(
        'ul',
        {
          directives: [{
            name: 'show',
            value: this.totalPages > 1
          }],

          'class': 'pagination'
        },
        [h(
          'li',
          { 'class': ' page-item prev-chunk ' + this.allowedChunkClass(-1) },
          [h(
            'a',
            {
              'class': 'page-link', attrs: {
              href: 'javascript:void(0);'
            },
              on: {
                click: this.setChunk.bind(this, -1)
              }
            },
            ['<<']
          )]
        ), h(
          'li',
          { 'class': ' page-item prev-page ' + this.allowedPageClass(this.page - 1) },
          [h(
            'a',
            {
              'class': 'page-link', attrs: {
              href: 'javascript:void(0);'
            },
              on: {
                click: this.prev.bind(this)
              }
            },
            ['<']
          )]
        ), items, h(
          'li',
          { 'class': ' page-item next-page ' + this.allowedPageClass(this.page + 1) },
          [h(
            'a',
            {
              'class': 'page-link', attrs: {
              href: 'javascript:void(0);'
            },
              on: {
                click: this.next.bind(this)
              }
            },
            ['>']
          )]
        ), h(
          'li',
          { 'class': ' page-item next-chunk ' + this.allowedChunkClass(1) },
          [h(
            'a',
            {
              'class': 'page-link', attrs: {
              href: 'javascript:void(0);'
            },
              on: {
                click: this.setChunk.bind(this, 1)
              }
            },
            ['>>']
          )]
        )]
      ), h(
        'p',
        {
          directives: [{
            name: 'show',
            value: parseInt(this.records)
          }],

          'class': 'count'
        },
        [this.count]
      )]
    )
  }
}