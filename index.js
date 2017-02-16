var WElement = require('./welement')
var WText = require('./wtext')

function vdomDom(vnode) {
  return vnode.type === 'VirtualText' ? new WText(vnode) : new WElement(vnode)
}

module.exports = vdomDom
