const cheerio = require('cheerio')
const jeerio = require('../jeerio')

const assert = require('assert')

const globalIt = global.it
const it = function (description, callback, only) {
  if (callback.length < 1) throw new Error('it expects arity 1 or more')

  const _it = only ? globalIt.only : globalIt

  _it(description + ' CHEERIO', function () {
    callback(cheerio)
  })

  _it(description + ' JEERIO', function () {
    callback(jeerio)
  })
}
it.only = function(description, callback) {
  return it(description, callback, true)
}

describe('cheerio', function() {
  describe('.attr(name)', function() {
    it('reads id attributes', function(cheerio) {

      const $ = cheerio.load('<b id="x">Hello</b>')

      assert.equal($('b').attr('id'), 'x')
    })
  })

  describe('.attr(name)', function() {
    const html = '<b id="x">Hello <i class="y">Mate</i> <i>ok?</i></b>'
    let $

    context('with CHEERIO', function() {
      beforeEach(function() { $ = cheerio.load(html) })

      globalIt('reads id attributes', function() {
        for (var i = 0; i < 100; i++) {
          assert.equal($('b').attr('id'), 'x')
        }
      })

      globalIt('traverses with css', function() {
        for (var i = 0; i < 200; i++) {
          assert.equal($('b:not(.x' + i + '), x.foo, z' + i).attr('id'), 'x')
        }
      })
    })

    context('with JEERIO', function() {
      beforeEach(function() { $ = jeerio.load(html) })

      globalIt('reads id attributes', function() {
        for (var i = 0; i < 100; i++) {
          assert.equal($('b').attr('id'), 'x')
        }
      })

      globalIt('traverses with css', function() {
        for (var i = 0; i < 200; i++) {
          assert.equal($('b:not(.x' + i + '), x.foo, z' + i).attr('id'), 'x')
        }
      })
    })
  })
})
