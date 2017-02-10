function VWindow(document, location) {
  this.document = document
  this.location = location
}

VWindow.prototype.setTimeout = function(callback, waitMilliseconds) {
}

module.exports = VWindow
