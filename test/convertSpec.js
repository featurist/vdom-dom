const convert = require('../convert')
const assert = require('assert')

describe('convert', function() {
  it('converts a single html element to a single vnode', function() {
    const html = '<a id="w" class="x" y="z"><b>Hola</b></a>'
    const vdom = convert.htmlToVdom(html)
    assert.deepEqual(vdom.properties, {
      id: 'w',
      className: 'x',
      attributes: { y: 'z' }
    })
  })

  it('converts multiple html elements to an array of vnodes', function() {
    const html = '<a id="w" class="x" y="z"></a><b>Hola</b>'
    const vdom = convert.htmlToVdom(html)
    assert.deepEqual(vdom[0].properties, {
      id: 'w',
      className: 'x',
      attributes: { y: 'z' }
    })
  })
})
