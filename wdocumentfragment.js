var WElement = require('./welement')
var WText = require('./wtext')
var VText = require('virtual-dom/vnode/vtext')
var WComment = require('./wcomment')

function WDocumentFragment() {
  this.childNodes = []
}

WDocumentFragment.prototype.nodeType = 11

WDocumentFragment.prototype.appendChild = function(child) {
  this.childNodes.push(child)
  return child
}

Object.defineProperty(WDocumentFragment.prototype, 'textContent', {
  set: function(text) {
    overwriteChildNodes(this, [].concat(new VText(text)))
  }
})

Object.defineProperty(WDocumentFragment.prototype, 'firstChild', {
  get: function() {
    return this.childNodes[0]
  }
})

Object.defineProperty(WDocumentFragment.prototype, 'lastChild', {
  get: function() {
    return this.childNodes[this.childNodes.length - 1]
  }
})

function overwriteChildNodes(element, children) {
  if (element.childNodes) {
    element.childNodes.forEach(function(child) {
      child.parentNode = null
    })
  }
  element.childNodes = children.map(function(child) {
    if (child.extended) {
      if (child.extended.type == 'comment') {
        return new WComment(child, element)
      } else {
        throw new Error("Unsupported node " + child.extended.type)
      }
    }
    return child.type === 'VirtualText' ?
      new WText(child, element) : new WElement(child, element)
  })
}

module.exports = WDocumentFragment
