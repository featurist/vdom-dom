function WText(vnode, parentNode) {
  this.vnode = vnode
  this.parentNode = parentNode
  this.textContent = vnode.text
  this.nodeValue = vnode.text
  // cheerio
  this.data = vnode.text
  this.type = 'text'
}

Object.defineProperty(WText.prototype, 'ownerDocument', {
  get: function() {
    var top = this
    while (top.parentNode) {
      top = top.parentNode
    }
    return top
  }
})

WText.prototype.nodeType = 3

module.exports = WText
