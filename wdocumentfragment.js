function WDocumentFragment() {
  this.childNodes = []
}

WDocumentFragment.prototype.nodeType = 11

WDocumentFragment.prototype.appendChild = function(child) {
  this.childNodes.push(child)
  return child
}

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

module.exports = WDocumentFragment
