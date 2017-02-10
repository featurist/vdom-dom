var VText = require('./vtext')

function VElement(node) {
  this.tagName = node.tagName
  this.node = node
  this.childNodes = node.children.map(function(child) {
    return child.type === 'VirtualText' ? new VText(child) : new VElement(child)
  })
  this.lastChild = this.childNodes[this.childNodes.length - 1]
}

VElement.prototype.nodeType = 1

VElement.prototype.getElementsByTagName = function(tagName) {
  var elements = []
  var queue = [].concat(this.childNodes)
  while (queue.length > 0) {
    var child = queue.shift()
    if (child.nodeType == 1 && child.tagName.toLowerCase() == tagName.toLowerCase()) {
      elements.push(child)
    }
    queue = queue.concat(child.childNodes || [])
  }
  return elements
}

VElement.prototype.setAttribute = function(name, value) {
}

VElement.prototype.appendChild = function(child) {
  this.node.children.push(child.node)
  this.childNodes.push(child)
  return child
}

VElement.prototype.cloneNode = function(deep) {
  return new VElement(this.node)
}

module.exports = VElement
