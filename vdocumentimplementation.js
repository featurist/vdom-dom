var VElement = require('./velement')
var h = require('virtual-dom/h')

function VDocumentImplementation(VDocument) {
  this.VDocument = VDocument
}

VDocumentImplementation.prototype.createHTMLDocument = function() {
  return new this.VDocument(new VElement(h('html', {}, [h('body', {}, [])])))
}

module.exports = VDocumentImplementation
