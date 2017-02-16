var VText = require('./vtext')
var vdomToHtml = require('vdom-to-html')
var htmlToVdom = require('html-to-vdom')({
  VNode: require('virtual-dom/vnode/vnode'),
  VText: require('virtual-dom/vnode/vtext')
});

function VElement(node) {
  this.tagName = node.tagName
  this.node = node

  overwriteChildNodes(this, node.children)

  Object.defineProperty(this, 'innerHTML', {
    set: function(html) {
      overwriteChildNodes(this, [].concat(htmlToVdom(html)))
    }.bind(this),
    get: function() {
      return this.node.children.map(function (child) {
        return vdomToHtml(child) }).join('')
      }.bind(this)
  });

  Object.defineProperty(this, 'lastChild', {
    get: function() {
      return this.childNodes[this.childNodes.length - 1]
    }.bind(this)
  });
}

function overwriteChildNodes(element, children) {
  element.node.children = children
  element.childNodes = children.map(function(child) {
    return child.type === 'VirtualText' ? new VText(child) : new VElement(child)
  })
}

VElement.prototype.nodeType = 1

VElement.prototype.getElementsByTagName = function(tagName) {
  var elements = []
  var queue = [].concat(this.childNodes)
  while (queue.length > 0) {
    var child = queue.shift()
    if (child.nodeType == 1 &&
        child.tagName.toLowerCase() == tagName.toLowerCase()) {
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
