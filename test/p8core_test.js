/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  
  module('core.date');
  test('p8XXJSON', 2, function() {
    var jsonDate = '2008-09-08T15:47:31.000Z';
    var date = new Date().p8fromJSON(jsonDate);
    
    equal(date.getUTCHours(), 15, "from hours");
    equal(date.p8toJSON(), jsonDate);
  });
  
  test('p8DeDate', 2, function() {
    var jsonDate = '2008-09-08T15:47:31.000Z';
    var date = new Date().p8fromJSON(jsonDate);
    
    equal(date.p8DeDate(), "08.09.2008");
    equal(date.p8DeDate(true), "08.09.2008 15:47");
  });  
  
  
  module('jQuery.nl2br');

  test('nl2br', 4, function() {
    equal($.nl2br("nl2\nbr"), "nl2<br />br", 'new line');
    equal($.nl2br("first\nsecond\nthird"), "first<br />second<br />third", 'two new lines');

    equal($.nl2br("nl2\rbr"), "nl2<br />br", 'carriage return');
    equal($.nl2br("first\r\nsecond\r\nthird"), "first<br />second<br />third", 'two new lines');
  });

  module('jQuery.getUrlVars');

  test('getUrlVars', 29, function() {
    deepEqual($.getUrlVars("http://www.test.ch/?test=1"), [ 'test' ], '?test=1 array');
    equal($.getUrlVars("http://www.test.ch/?test=1")['test'], 1, '?test=1 value');
    equal($.getUrlVars("http://www.test.ch/?test=1")[0], 'test', '?test=1 array index');

    deepEqual($.getUrlVars("http://www.test.ch/?test"), [ 'test' ], '?test array');
    strictEqual($.getUrlVars("http://www.test.ch/?test")['test'], undefined, '?test value');

    deepEqual($.getUrlVars("http://www.test.ch/?test="), [ 'test' ], '?test= array');
    strictEqual($.getUrlVars("http://www.test.ch/?test=")['test'], "", '?test= value');

    equal($.getUrlVars("http://www.test.ch/?a=1&b=2")['a'], '1', '?a=1&b=2 a value');
    equal($.getUrlVars("http://www.test.ch/?a=1&b=2")['b'], 2, '?a=1&b=2 b value');
    equal($.getUrlVars("http://www.test.ch/?a=1&b=2").length, 2, '?a=1&b=2 array length');

    strictEqual($.getUrlVars("http://www.test.ch/?a&b=2")['a'], undefined, '?a&b=2 a value');
    equal($.getUrlVars("http://www.test.ch/?a&b=2")['b'], 2, '?a&b=2 b value');

    strictEqual($.getUrlVars("http://www.test.ch/?a=&b=2")['a'], '', '?a=&b=2 a value');
    equal($.getUrlVars("http://www.test.ch/?a=&b=2")['b'], 2, '?a=&b=2 b value');

    equal($.getUrlVars("http://www.test.ch/?a=1&b")['a'], '1', '?a=1&b a value');
    strictEqual($.getUrlVars("http://www.test.ch/?a=1&b")['b'], undefined, '?a=1&b b value');

    equal($.getUrlVars("http://www.test.ch/?a=1&b=")['a'], '1', '?a=1&b= a value');
    strictEqual($.getUrlVars("http://www.test.ch/?a=1&b=")['b'], "", '?a1=&b= b value');

    equal($.getUrlVars("http://www.test.ch/?a=1&b&c=3")['a'], '1', '?a=1&b&c=3 a value');
    strictEqual($.getUrlVars("http://www.test.ch/?a=1&b&c=3")['b'], undefined, '?a=1&b&c=3 b value');
    equal($.getUrlVars("http://www.test.ch/?a=1&b&c=3")['c'], '3', '?a=1&b&c=3 c value');

    equal($.getUrlVars("http://www.test.ch/?a=1&b=&c=3")['a'], '1', '?a=1&b=&c=3 a value');
    strictEqual($.getUrlVars("http://www.test.ch/?a=1&b=&c=3")['b'], "", '?a=1&b=&c=3 b value');
    equal($.getUrlVars("http://www.test.ch/?a=1&b=&c=3")['c'], '3', '?a=1&b=&c=3 c value');

    //wrong urls
    //the length is 3 because one index is empty
    equal($.getUrlVars("http://www.test.ch/&a=1&b=2").length, 3, '&a=1&b=2 array length');
    equal($.getUrlVars("http://www.test.ch/&a=1&b=2")['a'], '1', '&a=1&b=2 a value');
    equal($.getUrlVars("http://www.test.ch/&a=1&b=2")['b'], 2, '&a=1&b=2 b value');

    equal($.getUrlVars("http://www.test.ch/?a=1?b=2").length, 1, '?a=1?b=2 array length');
    equal($.getUrlVars("http://www.test.ch/?a=1?b=2")['a'], '1?b', '?a=1?b=2 a value');

  });

  test('getUrlVar', 16, function() {
    strictEqual($.getUrlVar('test', 'http://www.test.ch/?test'), undefined, '?test value');
    strictEqual($.getUrlVar('test', 'http://www.test.ch/?test='), "", '?test= value');
    strictEqual($.getUrlVar('test', 'http://www.test.ch/?test=1'), "1", '?test= value');
    equal($.getUrlVar('test', 'http://www.test.ch/?test=1'), 1, '?test= value int');

    strictEqual($.getUrlVar('a', 'http://www.test.ch/?a&b=2'), undefined, '?a&b=2 a value');
    strictEqual($.getUrlVar('b', 'http://www.test.ch/?a&b=2'), "2", '?a&b=2 b value');

    strictEqual($.getUrlVar('a', 'http://www.test.ch/?a=&b=2'), "", '?a=&b=2 a value');
    strictEqual($.getUrlVar('b', 'http://www.test.ch/?a=&b=2'), "2", '?a=&b=2 b value');

    strictEqual($.getUrlVar('a', 'http://www.test.ch/?a=1&b'), "1", '?a=1&b a value');
    strictEqual($.getUrlVar('b', 'http://www.test.ch/?a=1&b'), undefined, '?a=1&b b value');

    strictEqual($.getUrlVar('a', 'http://www.test.ch/?a=1&b='), "1", '?a=1&b=2 a value');
    strictEqual($.getUrlVar('b', 'http://www.test.ch/?a=1&b='), "", '?a=1&b b value');

    //wrong urls
    strictEqual($.getUrlVar('a', 'http://www.test.ch/&a=1&b=2'), "1", '&a=1&b=2 a value');
    strictEqual($.getUrlVar('b', 'http://www.test.ch/&a=1&b=2'), "2", '&a=1&b=2 b value');

    strictEqual($.getUrlVar('a', 'http://www.test.ch/?a=1?b=2'), "1?b", '?a=1?b=2 a value');
    strictEqual($.getUrlVar('b', 'http://www.test.ch/?a=1?b=2'), undefined, '?a=1?b=2 b value');

  });

  module('jQuery.extractUrl');

  test('extractUrl', 4, function() {
    equal($.extractUrl('url("test/image.jpg")'), 'test/image.jpg', 'url("test/image.jpg"))');
    equal($.extractUrl('url(test/image.jpg)'), 'test/image.jpg', 'url(test/image.jpg))');
    equal($.extractUrl('test/image.jpg'), 'test/image.jpg', 'test/image.jpg');
    equal($.extractUrl("url('test/image.jpg')"), 'test/image.jpg', "url('test/image.jpg'))");
  });

  module('jQuery.scaleSize');

  test('scaleSize', 4, function() {
    deepEqual($.scaleSize(100, 100, 140, 120), [ 100, 85.71428571428571 ], 'width no round');
    deepEqual($.scaleSize(100, 100, 140, 120, true), [ 100, 86 ], 'width round');

    deepEqual($.scaleSize(100, 100, 120, 140, true), [ 86, 100 ], 'height round');
    deepEqual($.scaleSize(100, 100, 90, 120, true), [ 75, 100 ], 'width smaler than height, but height bigger than max ');
  });

}(jQuery));
