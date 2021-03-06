var WDocumentFragment = require('./wdocumentfragment')
var WDocumentImplementation = require('./wdocumentimplementation')
var WElement = require('./welement')
var h = require('virtual-dom/h')

function WDocument(vhtml) {
  this.childNodes = [].concat(new WElement(vhtml, this))
  this.implementation = new WDocumentImplementation(WDocument)

  Object.defineProperty(this, 'documentElement', {
    get: function() {
      return this.childNodes.find(function(child) {
        return child.tagName == 'HTML'
      })
    }.bind(this)
  })

  Object.defineProperty(this, 'head', {
    get: function() {
      return this.documentElement.childNodes.find(function(child) {
        return child.tagName == 'HEAD'
      })
    }.bind(this)
  })

  Object.defineProperty(this, 'body', {
    get: function() {
      return this.documentElement.childNodes.find(function(child) {
        return child.tagName == 'BODY'
      })
    }.bind(this)
  })
}

WDocument.prototype.nodeType = 9

WDocument.prototype.getElementById = function(id) {
  const queue = [].concat(this.childNodes)
  while (queue.length > 0) {
    const current = queue.shift()
    if (current.id == id) {
      return current
    } else if (current.childNodes) {
      for (let i = 0; i < current.childNodes.length; ++i)
        queue.push(current.childNodes[i])
    }
  }
  return null
}

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
  return new WElement(h(tagName), this)
}

WDocument.prototype.removeChild = function(child) {
  // TODO
}

WDocument.prototype.write = function(html) {
  this.innerHTML = html
}

module.exports = WDocument
