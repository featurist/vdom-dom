var WElement = require('./welement')
var h = require('virtual-dom/h')

function WDocumentImplementation(WDocument) {
  this.WDocument = WDocument
}

WDocumentImplementation.prototype.createHTMLDocument = function() {
  return new this.WDocument(new WElement(h('html', {}, [h('body', {}, [])])))
}

module.exports = WDocumentImplementation
