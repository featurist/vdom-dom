function WText(vnode, ownerDocument) {
  this.vnode = vnode
  this.ownerDocument = ownerDocument
  this.textContent = vnode.text
  this.nodeValue = vnode.text
}

WText.prototype.nodeType = 3

module.exports = WText
