export default {

  request: function (req, token) {
    token = token.split(';')
    if (req.url.indexOf('refresh') > -1) {
      req.url += '?refresh_token=' + token[1]
    }
    this.options.http._setHeaders.call(this, req, { Authorization: 'Bearer ' + token[0] })
  },

  response: function (res) {
    const headers = this.options.http._getHeaders.call(this, res)
    let token = headers.Authorization || headers.authorization
    const data = this.options.http._httpData.call(this, res)
    if (token) {
      token = token.split(/Bearer\:?\s?/i)
      return token[token.length > 1 ? 1 : 0].trim()
    } else if (data.token) {
      return data.token + ';' + data.refresh_token
    }
  }
}
