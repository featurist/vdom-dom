function WComment(vnode, parentNode) {
  this.vnode = vnode
  this.parentNode = parentNode
  this.textContent = vnode.extended.data
  this.nodeValue = vnode.extended.data
  // cheerio
  this.data = vnode.extended.data
  this.type = 'comment'
}

WComment.prototype.nodeType = 8

module.exports = WComment
