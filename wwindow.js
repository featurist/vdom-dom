function WWindow(document, location) {
  this.document = document
  this.location = location
}

WWindow.prototype.setTimeout = function(callback, waitMilliseconds) {
}

module.exports = WWindow
