var VNode = require('virtual-dom/vnode/vnode')
var VText = require('virtual-dom/vnode/vtext')
var vdomToHtml = require('vdom-to-html')
var htmlToVdom = require('html-to-vdom')({ VNode: VNode, VText: VText })

var convert = {
  htmlToVdom: function(html) {
    var vdom = htmlToVdom(html)
    normaliseVdom(vdom)
    return vdom
  },

  vdomToHtml: function(vdom) {
    return vdomToHtml(vdom)
  }
}
function convertAttributeToProperty(vdom, name, newName) {
  if (vdom.properties &&
      vdom.properties.attributes &&
      typeof vdom.properties.attributes[name] == 'string') {
    vdom.properties[newName] = vdom.properties.attributes[name]
    delete vdom.properties.attributes[name]
  }
}

function normaliseVdom(vdom) {
  if (typeof vdom.map == 'function') {
    return vdom.map(normaliseVdom)
  }
  convertAttributeToProperty(vdom, 'class', 'className')

  if (vdom.children) {
    for (var i = 0; i < vdom.children.length; ++i) {
      normaliseVdom(vdom.children[i])
    }
  }
}

module.exports = convert
