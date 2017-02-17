const h = require('virtual-dom/h')
const assert = require('assert')

const WWindow = require('../wwindow')
const WDocument = require('../wdocument')
const WElement = require('../welement')
const WLocation = require('../wlocation')

const globalIt = global.it
const it = function (description, callback, only) {
  if (callback.length != 1) throw new Error('it expects arity 1')

  const _it = only ? globalIt.only : globalIt

  if (typeof(window) !== 'undefined') {
    _it(description, function () {
      callback(document)
    })
  }

  _it(description + ' VDOM', function () {
    const vhtml = h('html', {}, [h('body')])
    const document = new WDocument(vhtml)
    const location = new WLocation('http://example.com')
    const window = new WWindow(document, location)
    callback(document)
  })
}
it.only = function(description, callback) {
  return it(description, callback, true)
}

describe('DOM', function() {
  describe('document.getElementsByTagName("a")', function () {
    it('finds one element', function (document) {
      document.body.innerHTML = '<a>OK</a>'
      assert.equal(document.getElementsByTagName('a').length, 1)
    })
  })

  describe('document.body', function () {
    it('has .ownerDocument equal to the document', function(document) {
      assert.equal(document.body.ownerDocument, document)
    })
  })

  describe('element.innerHTML', function () {
    it('sets the ownerDocument of all assigned elements', function(document) {
      document.body.innerHTML = '<a><b>OK</b></a>'
      assert.equal(document.getElementsByTagName('a')[0].ownerDocument, document)
      assert.equal(document.getElementsByTagName('b')[0].ownerDocument, document)
    })
  })

  describe('element.cloneNode(false)', function () {
    it('creates a shallow copy of the element', function(document) {
      document.body.innerHTML = '<a><b>OK</b></a>'
      assert.equal(document.getElementsByTagName('a')[0].cloneNode(false).innerHTML, '')
    })
  })
})
