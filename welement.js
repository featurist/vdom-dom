var WAttr = require('./wattr')
var WText = require('./wtext')
var VText = require('virtual-dom/vnode/vtext')
var WComment = require('./wcomment')
var convert = require('./convert')

function WElement(vnode, parentWNode) {
  if (vnode.type !== 'VirtualNode') throw new Error("vnode must be a VirtualNode")
  if (typeof parentWNode === 'undefined') throw new Error("parentNode cannot be undefined")
  this.tagName = this.nodeName = vnode.tagName.toUpperCase()
  this.vnode = vnode
  this.parentNode = parentWNode

  overwriteChildNodes(this, vnode.children)
}

Object.defineProperty(WElement.prototype, 'id', {
  set: function(value) {
    this.setAttribute('id', value)
  },
  get: function() {
    return this.getAttribute('id')
  }
})

Object.defineProperty(WElement.prototype, 'className', {
  set: function(value) {
    this.vnode.properties.className = value
  },
  get: function() {
    return this.vnode.properties.className
  }
})

Object.defineProperty(WElement.prototype, 'innerHTML', {
  set: function(html) {
    overwriteChildNodes(this, [].concat(convert.htmlToVdom(html)))
  },
  get: function() {
    return this.vnode.children.map(function (child) {
      return convert.vdomToHtml(child) }).join('')
  }
})

Object.defineProperty(WElement.prototype, 'textContent', {
  set: function(text) {
    overwriteChildNodes(this, [].concat(new VText(text)))
  }
})

// cheerio
Object.defineProperty(WElement.prototype, 'data', {
  get: function() {
    return this.innerHTML
  }
})
// cheerio
Object.defineProperty(WElement.prototype, 'name', {
  get: function() {
    return this.tagName.toLowerCase()
  }
})

Object.defineProperty(WElement.prototype, 'outerHTML', {
  get: function() {
    return convert.vdomToHtml(this.vnode)
  }
})

Object.defineProperty(WElement.prototype, 'firstChild', {
  get: function() {
    return this.childNodes[0]
  }
})

Object.defineProperty(WElement.prototype, 'lastChild', {
  get: function() {
    return this.childNodes[this.childNodes.length - 1]
  }
})

Object.defineProperty(WElement.prototype, 'nextSibling', {
  get: function() {
    return this.parentNode ? this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1] : undefined
  }
})

Object.defineProperty(WElement.prototype, 'previousSibling', {
  get: function() {
    return this.parentNode ? this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1] : undefined
  }
})

Object.defineProperty(WElement.prototype, 'ownerDocument', {
  get: function() {
    var top = this
    while (top.parentNode) {
      top = top.parentNode
    }
    return top
  }
})

Object.defineProperty(WElement.prototype, 'attribs', {
  get: function() {
    return Object.assign(this.vnode.properties, this.vnode.properties.attributes || {}, { 'class': this.vnode.properties.className })
  }
})

function overwriteChildNodes(element, children) {
  if (element.childNodes) {
    element.childNodes.forEach(function(child) {
      child.parentNode = null
    })
  }
  element.vnode.children = children
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
  } else if (name == 'crossorigin') {
    return this.vnode.properties.crossOrigin
  } else if (name == 'alt') {
    return this.vnode.properties.alt
  } else if (name == 'src') {
    return this.vnode.properties.src
  } else if (name == 'href') {
    return this.vnode.properties.href
  } else if (name == 'download') {
    return this.vnode.properties.download
  } else if (name == 'hreflang') {
    return this.vnode.properties.hrefLang
  } else if (name == 'rel') {
    return this.vnode.properties.rel
  } else if (name == 'target') {
    return this.vnode.properties.target
  } else if (name == 'type') {
    return this.vnode.properties.type
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
  if (child.nodeType == 11) {
    // document fragment
    var self = this
    child.childNodes.forEach(function(fragChild) {
      fragChild.parentNode = self
      self.appendChild(fragChild)
    })
  } else {
    // element
    this.vnode.children.push(child.vnode)
    this.childNodes.push(child)
  }
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
