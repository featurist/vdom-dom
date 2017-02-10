const h = require('virtual-dom/h')
const assert = require('assert')

const vdomDom = require('..')
const VWindow = require('../vwindow')
const VDocument = require('../vdocument')
const VElement = require('../velement')
const VLocation = require('../vlocation')

describe('vdom-dom', function() {
  it('makes jquery work against a vdom', function() {
    const html = h('html', {}, [h('body', {}, ['howdy'])])
    const document = new VDocument(new VElement(html))
    const location = new VLocation('http://example.com')
    const window = new VWindow(document, location)
    const jquery = require('jquery')
    const $ = jquery(window)
    assert.equal('BODY', $.find('body')[0].tagName)
  })
})
