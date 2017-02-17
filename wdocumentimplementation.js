var h = require('virtual-dom/h')

function WDocumentImplementation(WDocument) {
  this.WDocument = WDocument
}

WDocumentImplementation.prototype.createHTMLDocument = function() {
  return new this.WDocument(h('html', {}, [h('body', {}, [])]))
}

module.exports = WDocumentImplementation
