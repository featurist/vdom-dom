var VElement = require('./velement')
var VText = require('./vtext')

function vdomDom(vnode) {
  return vnode.type === 'VirtualText' ? new VText(vnode) : new VElement(vnode)
}

module.exports = vdomDom
