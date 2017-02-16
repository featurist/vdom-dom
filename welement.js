var WText = require('./wtext')
var convert = require('./convert')

function WElement(vnode) {
  this.tagName = vnode.tagName
  this.vnode = vnode

  overwriteChildNodes(this, vnode.children)

  Object.defineProperty(this, 'id', {
    set: function(value) {
      this.setAttribute('id', value)
    }.bind(this),
    get: function() {
      return this.getAttribute('id')
    }
  })

  Object.defineProperty(this, 'className', {
    set: function(value) {
      this.vnode.properties.className = value
    }.bind(this),
    get: function() {
      return this.vnode.properties.className
    }
  })

  Object.defineProperty(this, 'innerHTML', {
    set: function(html) {
      overwriteChildNodes(this, [].concat(convert.htmlToVdom(html)))
    }.bind(this),
    get: function() {
      return this.vnode.children.map(function (child) {
        return convert.vdomToHtml(child) }).join('')
      }.bind(this)
  })

  Object.defineProperty(this, 'lastChild', {
    get: function() {
      return this.childNodes[this.childNodes.length - 1]
    }.bind(this)
  })
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

WElement.prototype.getAttribute = function(name) {
  if (name == 'id') {
    return this.vnode.properties.id
  } else if (name == 'class') {
    return this.vnode.properties.className ||
           this.vnode.properties.attributes['class'] // html-to-vdom does this
  } else {
    return this.vnode.properties.attributes[name]
  }
}

WElement.prototype.setAttribute = function(name, value) {
  if (name == 'id') {
    this.vnode.properties.id = value
  } else if (name == 'class') {
    this.vnode.properties.className = value
  } else {
    this.vnode.properties.attributes = this.vnode.properties.attributes || {}
    this.vnode.properties.attributes[name] = value
  }
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
