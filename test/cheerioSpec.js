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
})
