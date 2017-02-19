const h = require('virtual-dom/h')
var WDocument = require('./wdocument')
var WLocation = require('./wlocation')
var WWindow = require('./wwindow')
var convert = require('./convert')
var jquery = require('./test/support/jquery-commonjs')

function Jeerio() {
  const vhtml = h('html', {}, [h('body')])
  const document = new WDocument(vhtml)
  var location = new WLocation('http://example.com')
  var window = new WWindow(document, location)
  this.$ = jquery(window)
}

Jeerio.prototype.load = function(html) {
  var $ = this.$(html)
  return function () {
    return $.find.apply($, arguments)
  }
}

module.exports = new Jeerio
