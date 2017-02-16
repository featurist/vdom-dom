// loading jquery binds it on to a global `window` if there is one. In electron,
// there is a global `window`, but we want to run the same specs like-for-like
// against the electron window and the virtual window. So we load a slightly
// hacked jquery, that doesn't try anything global...
const jquery = require('./support/jquery-commonjs')

const h = require('virtual-dom/h')
const assert = require('assert')

const vdomDom = require('..')
const WWindow = require('../wwindow')
const WDocument = require('../wdocument')
const WElement = require('../welement')
const WLocation = require('../wlocation')

const globalIt = global.it
const it = function (description, callback) {
  if (callback.length < 1) throw new Error('it expects arity 1')

  if (typeof(window) !== 'undefined') {
    globalIt(description, function () {
      callback(jquery(global.window))
    })
  }

  globalIt(description + ' (VDOM)', function () {
    const html = h('html', {}, [h('body')])
    const document = new WDocument(new WElement(html))
    const location = new WLocation('http://example.com')
    const window = new WWindow(document, location)
    callback(jquery(window))
  })
}

describe('jquery', function() {
  describe('.html(innerHTML)', function () {
    it('writes a single node', function ($) {
      $('body').html('<p>Howdy</p>')
      assert.equal($('p').length, 1)
    })

    it('writes multiple nodes', function ($) {
      $('body').html('<i>Howdy</i><i>Doody</i>')
      assert.equal($('i').length, 2)
    })
  })

  describe('.html()', function () {
    it('reads a single node', function ($) {
      $('body').html('<p>Howdy</p>')
      assert.equal($('body').html(), '<p>Howdy</p>')
    })

    it('writes multiple nodes', function ($) {
      $('body').html('<i>Howdy</i><i>Doody</i>')
      assert.equal($('body').html(), '<i>Howdy</i><i>Doody</i>')
    })
  })
})
