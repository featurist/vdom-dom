const h = require('virtual-dom/h')
const assert = require('assert')

const vdomDom = require('..')
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
    const html = h('html', {}, [h('body')])
    const document = new WDocument(new WElement(html))
    const location = new WLocation('http://example.com')
    const window = new WWindow(document, location)
    callback(document)
  })
}
it.only = function(description, callback) {
  return it(description, callback, true)
}

describe('document', function() {
  describe('.getElementsByTagName("a")', function () {
    it('finds one element', function (document) {
      document.body.innerHTML = '<a>OK</a>'
      assert.equal(document.getElementsByTagName('a').length, 1)
    })
  })
})
