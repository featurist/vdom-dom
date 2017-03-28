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
  describe('document.createDocumentFragment()', function() {
    it('creates a DocumentFragment node', function (document) {
      const frag = document.createDocumentFragment()
      assert.equal(frag.nodeType, 11)
    })

    it('can be appended to an element', function (document) {
      const element = document.createElement('p')
      const frag = document.createDocumentFragment()
      const child = document.createElement('i')
      child.textContent = 'yes'
      frag.appendChild(child)
      element.appendChild(frag)
      assert.equal(element.outerHTML, '<p><i>yes</i></p>')
      assert.equal(child.parentNode.tagName, 'P')
    })
  })

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

  describe('element.innerHTML = ...', function () {
    it('sets the ownerDocument of all assigned elements', function(document) {
      document.body.innerHTML = '<a><b>OK</b></a>'
      assert.equal(document.getElementsByTagName('a')[0].ownerDocument, document)
      assert.equal(document.getElementsByTagName('b')[0].ownerDocument, document)
      assert.equal(document.getElementsByTagName('b')[0].childNodes[0].ownerDocument, document)
    })

    it('adds comment nodes', function (document) {
      document.body.innerHTML = '<!-- howdy -->'
      assert.equal(document.body.childNodes[0].nodeType, 8)
      assert.equal(document.body.childNodes[0].nodeValue, ' howdy ')
    })
  })

  describe('element.textContent = ...', function () {
    it('overwrites childNodes with a text node', function (document) {
      document.body.innerHTML = '<b>1</b><b>2</b>'
      document.body.textContent = 'yeah'
      assert.equal(document.body.childNodes.length, 1)
    })

    it('orphans existing childNodes', function (document) {
      document.body.innerHTML = '<b>1</b>'
      const b = document.getElementsByTagName('b')[0]
      document.body.textContent = ''
      assert.equal(b.parentNode, null)
    })
  })

  describe('element.textContent', function () {
    it('gets the textContent of an element and its children', function (document) {
      document.body.innerHTML = '<div>hello <span>world<b>!</b></span>'
      assert.equal(document.body.textContent, 'hello world!')
    })
  })

  describe('documentFragment.textContent = ...', function () {
    it('orphans existing childNodes', function (document) {
      const frag = document.createDocumentFragment()
      const b = document.createElement('b')
      frag.appendChild(b)
      frag.textContent = ''
      assert.equal(b.parentNode, null)
    })
  })

  describe('element.nextSibling', function () {
    it('gets the next sibling', function (document) {
      document.body.innerHTML = '<p id="A">A</p><p id="B">B</p><p id="C">C</p>'
      assert.equal(document.getElementsByTagName('p')[0].nextSibling.id, 'B')
      assert.equal(document.getElementsByTagName('p')[1].nextSibling.id, 'C')
      assert.equal(document.getElementsByTagName('p')[2].nextSibling, undefined)
      assert.equal(document.documentElement.nextSibling, undefined)
    })
  })

  describe('element.previousSibling', function () {
    it('gets the previous sibling', function(document) {
      document.body.innerHTML = '<p id="A">A</p><p id="B">B</p><p id="C">C</p>'
      assert.equal(document.getElementsByTagName('p')[0].previousSibling, undefined)
      assert.equal(document.getElementsByTagName('p')[1].previousSibling.id, 'A')
      assert.equal(document.getElementsByTagName('p')[2].previousSibling.id, 'B')
    })
  })

  describe('element.cloneNode(false)', function () {
    it('creates a shallow copy of the element', function(document) {
      document.body.innerHTML = '<a><b>OK</b></a>'
      assert.equal(document.getElementsByTagName('a')[0].cloneNode(false).innerHTML, '')
    })
  })

  describe('element.contains(other)', function () {
    it('is true when other is a descendant or self', function (document) {
      document.body.innerHTML = '<div id="a"><div id="b"><div id="c">OK</div></div></div>'
      assert.equal(document.getElementById('a').contains(document.getElementById('b')), true)
      assert.equal(document.getElementById('a').contains(document.getElementById('c')), true)
      assert.equal(document.getElementById('a').contains(document.getElementById('a')), true)
      assert.equal(document.getElementById('c').contains(document.getElementById('a')), false)
    })
  })

  describe('element.getAttribute', function () {
    it('gets an attribute when attributes is null', function (document) {
      var el = document.createElement('div')
      el.id = 'message'
      document.body.appendChild(el)
      assert.equal(document.getElementById('message').getAttribute('notRealAttribute'), null)
    })

    it('gets the style of an element', function (document) {
      document.body.innerHTML = '<div id="message" style="color:bold">text</div>'
      assert.equal(document.getElementById('message').getAttribute('style'), 'color: bold')
    })
  })

  describe('element.setAttribute', function () {
    it('sets the style of an element', function (document) {
      document.body.innerHTML = '<div id="message">text</div>'
      document.getElementById('message').setAttribute('style', 'color: bold')
      assert.equal(document.getElementById('message').getAttribute('style'), 'color: bold')
    })
  })

  describe('element.removeAttribute', function () {
    it('removes the style of an element', function (document) {
      document.body.innerHTML = '<div id="message" style="color:bold">text</div>'
      document.getElementById('message').removeAttribute('style')
      assert.equal(document.getElementById('message').getAttribute('style'), undefined)
    })
  })
  describe('select.options', function () {
    it('has option elements', function (document) {
      document.body.innerHTML = '<select id="select"><option id="one">one</option><option id="two" selected>two</option></select>'
      var options = document.getElementById('select').options
      assert.equal(options.indexOf(document.getElementById('one')), 0)
      assert.equal(options.indexOf(document.getElementById('two')), 1)
      assert.equal(options.selectedIndex, 1)
    })
    it('div.options is undefined', function (document) {
      document.body.innerHTML = '<div id="select"></div>'
      assert.equal(document.getElementById('select').options, undefined)
    })
  })
})
