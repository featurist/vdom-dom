var WAttr = require('./wattr')
var WText = require('./wtext')
var convert = require('./convert')

function WElement(vnode, parentWNode) {
  if (vnode.type !== 'VirtualNode') throw new Error("vnode must be a VirtualNode")
  if (typeof parentWNode === 'undefined') throw new Error("parentNode cannot be undefined")
  this.tagName = this.nodeName = vnode.tagName.toUpperCase()
  this.vnode = vnode
  this.parentNode = parentWNode

  overwriteChildNodes(this, vnode.children)

  this.toString = function() {
    return convert.vdomToHtml(this.vnode)
  }

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

  // cheerio
  Object.defineProperty(this, 'data', {
    get: function() {
      return this.innerHTML
    }.bind(this)
  })

  Object.defineProperty(this, 'outerHTML', {
    get: function() {
      return convert.vdomToHtml(this.vnode)
    }.bind(this)
  })

  Object.defineProperty(this, 'firstChild', {
    get: function() {
      return this.childNodes[0]
    }.bind(this)
  })

  Object.defineProperty(this, 'lastChild', {
    get: function() {
      return this.childNodes[this.childNodes.length - 1]
    }.bind(this)
  })

  Object.defineProperty(this, 'nextSibling', {
    get: function() {
      return this.parentNode ? this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1] : undefined
    }.bind(this)
  })

  Object.defineProperty(this, 'previousSibling', {
    get: function() {
      return this.parentNode ? this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1] : undefined
    }.bind(this)
  })

  Object.defineProperty(this, 'ownerDocument', {
    get: function() {
      var top = this
      while (top.parentNode) {
        top = top.parentNode
      }
      return top
    }.bind(this)
  })

  Object.defineProperty(this, 'attribs', {
    get: function() {
      return Object.assign(this.vnode.properties, this.vnode.properties.attributes || {}, { 'class': this.vnode.properties.className })
    }.bind(this)
  })
}

function overwriteChildNodes(element, children) {
  element.vnode.children = children
  element.childNodes = children.map(function(child) {
    return child.type === 'VirtualText' ?
      new WText(child, element) : new WElement(child, element)
  })
}

WElement.prototype.nodeType = 1

WElement.prototype.getElementsByTagName = function(tagName) {
  var tagNameUpperCase = tagName.toUpperCase()
  var elements = []
  var queue = [].concat(this.childNodes)
  while (queue.length > 0) {
    var child = queue.shift()
    if (child.nodeType == 1 &&
        (tagName == '*' || child.tagName == tagNameUpperCase)) {
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
    return this.vnode.properties.className
  } else {
    return this.vnode.properties.attributes[name]
  }
}

WElement.prototype.getAttributeNode = function(name) {
  return new WAttr(this.getAttribute(name))
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

WElement.prototype.removeChild = function(child) {
  this.vnode.children = this.vnode.children.filter(function(c) { return c != child.vnode })
  this.childNodes = this.childNodes.filter(function(c) { return c != child })
}

WElement.prototype.cloneNode = function(deep) {
  var clone = deep ? deepClone : shallowClone
  return new WElement(clone(this.vnode), this.parentNode)
}

WElement.prototype.contains = function(other) {
  if (this == other) return true
  const queue = [].concat(this.childNodes)
  while (queue.length > 0) {
    const current = queue.shift()
    if (current == other) {
      return true
    } else if (current.childNodes) {
      for (let i = 0; i < current.childNodes.length; ++i)
        queue.push(current.childNodes[i])
    }
  }
  return false
}


function deepClone(object) {
  var result, value, prop
  result = Array.isArray(object) ? [] : {}
  for (prop in object) {
    value = object[prop]
    result[prop] = (typeof value === "object") ? deepClone(value) : value
  }
  return result
}

function shallowClone(vnode) {
  var cloned = deepClone(vnode)
  cloned.children = []
  return cloned
}

module.exports = WElement
