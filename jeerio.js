const h = require('virtual-dom/h')
var WDocument = require('./wdocument')
var WLocation = require('./wlocation')
var WWindow = require('./wwindow')
var convert = require('./convert')
var jquery = require('./test/support/jquery-commonjs')

function Jeerio() {
  const vhtml = h('html', {}, [h('head'), h('body')])
  const document = new WDocument(vhtml)
  var location = new WLocation('http://example.com')
  var window = new WWindow(document, location)
  this.$ = jquery(window)
}

Jeerio.prototype.load = function(html) {
  var $ = this.$(html)
  var jQuery = this.$
  return function () {
    if (
      (typeof arguments[0] == 'string' && arguments[0].indexOf('<') == 0)
      ||
      arguments.length == 2
    ) {
      return jQuery.apply(null, arguments)
    }
    return $.find.apply($, arguments)
  }
}

module.exports = new Jeerio
