// loading jquery binds it on to a global `window` if there is one. In electron,
// there is a global `window`, but we want to run the same specs like-for-like
// against the electron window and the virtual window. So we load a slightly
// hacked jquery, that doesn't try anything global...
const jquery = require('./support/jquery-commonjs')

const h = require('virtual-dom/h')
const assert = require('assert')

const WWindow = require('../wwindow')
const WDocument = require('../wdocument')
const WElement = require('../welement')
const WLocation = require('../wlocation')

const globalIt = global.it
const it = function (description, callback, only) {
  if (callback.length < 1) throw new Error('it expects arity 1 or more')

  const _it = only ? globalIt.only : globalIt

  if (typeof(window) !== 'undefined') {
    _it(description, function () {
      callback(jquery(window), document)
    })
  }

  _it(description + ' VDOM', function () {
    const vhtml = h('html', {}, [h('body')])
    const document = new WDocument(vhtml)
    const location = new WLocation('http://example.com')
    const window = new WWindow(document, location)
    callback(jquery(window), document)
  })
}
it.only = function(description, callback) {
  return it(description, callback, true)
}

describe('jQuery', function() {
  describe('$("a")', function () {
    it('matches one element', function ($, document) {
      document.body.innerHTML = '<a>OK</a>'
      assert.equal($('a').length, 1)
    })
  })

  describe('$(".a")', function () {
    it('matches one element', function ($, document) {
      document.body.innerHTML = '<b class="a">OK</b>'
      assert.equal($('.a').length, 1)
    })
  })

  describe('.attr(name, value)', function () {
    it('sets an attribute of one element', function ($) {
      $('body').html('<b>Hello</b>')
      $('b').attr('x', 'y')
      assert.equal($('body').html(), '<b x="y">Hello</b>')
    })

    it('sets an attribute of multiple elements', function ($) {
      $('body').html('<i>X</i><i>Y</i>')
      $('i').attr('z', '1')
      assert.equal($('body').html(), '<i z="1">X</i><i z="1">Y</i>')
    })

    it('sets the id attribute of one element', function ($) {
      $('body').html('<b>Hello</b>')
      $('b').attr('id', 'y')
      assert.equal($('body').html(), '<b id="y">Hello</b>')
    })

    it('sets the id property of one element', function ($) {
      $('body').html('<b>Hello</b>')
      $('b').attr('id', 'y')
      assert.equal($('b')[0].id, 'y')
    })

    it('sets the className property of one element', function ($) {
      $('body').html('<b>Hello</b>')
      $('b').attr('class', 'y')
      assert.equal($('b')[0].className, 'y')
    })

    it('sets the class attribute of one element', function ($) {
      $('body').html('<b>Hello</b>')
      $('b').attr('class', 'y')
      assert.equal($('body').html(), '<b class="y">Hello</b>')
    })
  })

  describe('.attr(name)', function () {
    it('gets the id of one element', function ($) {
      $('body').html('<b>Hello</b>')
      $('b')[0].id = 'x'
      assert.equal($('b').attr('id'), 'x')
    })

    it('gets the id of the first element', function ($) {
      $('body').html('<b id="x">First</b><b id="y">Second</b>')
      assert.equal($('b').attr('id'), 'x')
    })

    it('gets the class of the first element', function ($) {
      $('body').html('<b class="x">First</b><b class="y">Second</b>')
      assert.equal($('b').attr('class'), 'x')
    })
  })

  describe('.html(innerHTML)', function () {
    it('writes a single node', function ($) {
      $('body').html('<p>Howdy</p>')
      assert.equal($('p').length, 1)
    })

    it('writes multiple nodes', function ($) {
      $('body').html('<i>Howdy</i><i>Doody</i>')
      assert.equal($('i').length, 2)
    })

    it('sets the ownerDocument of each node', function ($, document) {
      $('body').html('<i>Howdy</i><i>Doody</i>')
      assert.equal($('i')[0].ownerDocument, document)
      assert.equal($('i')[1].ownerDocument, document)
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

  describe('.addClass(className)', function () {
    it('sets the class attribute of one element', function ($) {
      $('body').html('<p>Hi</p>')
      $('p').addClass('z')
      assert.equal($('body').html(), '<p class="z">Hi</p>')
    })

    it('adds a class to the class attribute of one element', function ($) {
      $('body').html('<p class="y">Hi</p>')
      $('p').addClass('z')
      assert.equal($('body').html(), '<p class="y z">Hi</p>')
    })

    it('adds many classes to the class attribute of one element', function ($) {
      $('body').html('<p class="x">Hi</p>')
      $('p').addClass('y z')
      assert.equal($('body').html(), '<p class="x y z">Hi</p>')
    })

    it('adds many classes to the class attribute of many elements', function ($) {
      $('body').html('<p class="x">Hi</p><p class="a">Bye</p>')
      $('p').addClass('y z')
      assert.equal($('body').html(), '<p class="x y z">Hi</p><p class="a y z">Bye</p>')
    })
  })

  describe('.hasClass(className)', function () {
    it('is false when no elements have the class', function ($) {
      $('body').html('<a>Hi</a><a>Bye</a>')
      assert.equal($('a').hasClass('z'), false)
    })

    it('is true when some elements have the class', function ($) {
      $('body').html('<a class="x y z">Hi</a><a>Bye</a>')
      assert.equal($('a').hasClass('z'), true)
    })

    it('is true when all elements have the class', function ($) {
      $('body').html('<a class="x y z">Hi</a><b class="z">Bye</b>')
      assert.equal($('a, b').hasClass('z'), true)
    })
  })

  describe('.removeClass(className)', function () {
    it('removes multiple classes to leave empty class attribute', function ($) {
      $('body').html('<p><a class="x y z">Hi</a><a class="x y z">Bye</a></p>')
      $('a').removeClass('z y x')
      assert.equal($('p').html(), '<a class="">Hi</a><a class="">Bye</a>')
    })
  })

  describe('.toggleClass(className)', function () {
    it('adds classes then removes them', function ($) {
      $('body').html('<p><a>Hi</a><b>Bye</b></p>')
      $('a, b').toggleClass('x y')
      assert.equal($('p').html(), '<a class="x y">Hi</a><b class="x y">Bye</b>')
      $('a, b').toggleClass('x y')
      assert.equal($('p').html(), '<a class="">Hi</a><b class="">Bye</b>')
    })
  })

  describe('.clone()', function () {
    it('creates a deep copy of the set of matched elements', function ($) {
      $('body').html('<p><a><b>Banana</b></a></p>')
      var clone = $('p').clone()
      $('*').attr('x', 'y')
      assert.equal($('p').html(), '<a x="y"><b x="y">Banana</b></a>')
      assert.equal(clone.html(), '<a><b>Banana</b></a>')
    })
  })

  describe('.remove()', function () {
    it('removes the set of matched elements', function ($) {
      $('body').html('<p><a>A</a><b>B</b></p>')
      $('b').remove()
      assert.equal($('p').html(), '<a>A</a>')
    })
  })
})
