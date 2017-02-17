var WDocument = require('./wdocument')
var WLocation = require('./wlocation')
var WWindow = require('./wwindow')
var convert = require('./convert')
var jquery = require('./test/support/jquery-commonjs')

var jeerio = {
  load: function(html) {
    var vdom = convert.htmlToVdom(html)
    var document = new WDocument(vdom)
    var location = new WLocation('http://example.com')
    var window = new WWindow(document, location)
    return jquery(window)
  }
}

module.exports = jeerio
