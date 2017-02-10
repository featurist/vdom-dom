var VDocumentFragment = require('./vdocumentfragment')
var VDocumentImplementation = require('./vdocumentimplementation')
var VElement = require('./velement')
var h = require('virtual-dom/h')

function VDocument(documentElement) {
  this.documentElement = documentElement
  documentElement.ownerDocument = this
  this.implementation = new VDocumentImplementation(VDocument)
  this.body = documentElement.childNodes.find(function(child) {
    return child.tagName == 'BODY'
  })
}

VDocument.prototype.nodeType = 9

VDocument.prototype.getElementsByTagName = function(tagName) {
  var elements = []
  if (this.documentElement.tagName.toLowerCase() == tagName.toLowerCase()) {
    elements.push(this.documentElement)
  }
  elements = elements.concat(this.documentElement.getElementsByTagName(tagName))
  return elements
}

VDocument.prototype.createDocumentFragment = function() {
  return new VDocumentFragment()
}

VDocument.prototype.createElement = function(tagName) {
  return new VElement(h(tagName))
}

module.exports = VDocument
