var WDocumentFragment = require('./wdocumentfragment')
var WDocumentImplementation = require('./wdocumentimplementation')
var WElement = require('./welement')
var h = require('virtual-dom/h')

function WDocument(documentElement) {
  this.documentElement = documentElement
  documentElement.ownerDocument = this
  this.implementation = new WDocumentImplementation(WDocument)
  this.body = documentElement.childNodes.find(function(child) {
    return child.tagName == 'BODY'
  })
}

WDocument.prototype.nodeType = 9

WDocument.prototype.getElementsByTagName = function(tagName) {
  var elements = []
  if (tagName == '*' || this.documentElement.tagName.toLowerCase() == tagName.toLowerCase()) {
    elements.push(this.documentElement)
  }
  elements = elements.concat(this.documentElement.getElementsByTagName(tagName))
  return elements
}

WDocument.prototype.createDocumentFragment = function() {
  return new WDocumentFragment()
}

WDocument.prototype.createElement = function(tagName) {
  return new WElement(h(tagName))
}

module.exports = WDocument
