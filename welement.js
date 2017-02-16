var WText = require('./wtext')
var VNode = require('virtual-dom/vnode/vnode')
var VText = require('virtual-dom/vnode/vtext')
var vdomToHtml = require('vdom-to-html')
var htmlToVdom = require('html-to-vdom')({ VNode: VNode, VText: VText });

function WElement(vnode) {
  this.tagName = vnode.tagName
  this.vnode = vnode

  overwriteChildNodes(this, vnode.children)

  Object.defineProperty(this, 'innerHTML', {
    set: function(html) {
      overwriteChildNodes(this, [].concat(htmlToVdom(html)))
    }.bind(this),
    get: function() {
      return this.vnode.children.map(function (child) {
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
  element.vnode.children = children
  element.childNodes = children.map(function(child) {
    return child.type === 'VirtualText' ? new WText(child) : new WElement(child)
  })
}

WElement.prototype.nodeType = 1

WElement.prototype.getElementsByTagName = function(tagName) {
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

WElement.prototype.setAttribute = function(name, value) {
}

WElement.prototype.appendChild = function(child) {
  this.vnode.children.push(child.vnode)
  this.childNodes.push(child)
  return child
}

WElement.prototype.cloneNode = function(deep) {
  return new WElement(this.vnode)
}

module.exports = WElement
