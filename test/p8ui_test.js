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

  module('jQuery.p8AddHint', {});

  test('value', 4, function() {
    strictEqual('', $("#input1").val());
    $("#input1").p8AddHint();
    strictEqual("MyValue", $("#input1").val());

    strictEqual('Real Value2', $("#input2").val());
    $("#input2").p8AddHint();
    strictEqual("Real Value2", $("#input2").val());
    
  });
  
  
  asyncTest('focus #input1', 5, function() {
    $("#input1").p8AddHint();
    strictEqual("MyValue", $("#input1").val(), "before");
    ok($("#input1").is(".hint_text"));

    $("#input1").focus(function() {
      ok($("#input1").is(":not(.hint_text)"), "no hint class");
      strictEqual('', $("#input1").val(), "focused");
      $("#input1").val("New Val");
    }).focus(500, function() {
        $( this ).unbind( "focus" );
        $("#input2").focus();
        strictEqual('New Val', $("#input1").val(), "after focus and change");
        start();
    });    
  });

  asyncTest('focus class #input1', 3 , function() {
    $("#input1").p8AddHint();
    ok($("#input1").is(".hint_text"), 'hint class');

    $("#input1").focus(function() {
      ok($("#input1").is(":not(.hint_text)"), "no hint class");
    }).focus(500, function() {
        $( this ).unbind( "focus" );
        $("#input2").focus();
        ok($("#input1").is(".hint_text"), "after focus lost");
        start();
    });    
  });
  
  
  
  
  
  asyncTest('focus #input2', 6, function() {
    $("#input2").p8AddHint();
    strictEqual("Real Value2", $("#input2").val(), "before");
    ok($("#input2").is(":not(.hint_text)"), "no hint class");

    $("#input2").focus(function() {
      ok($("#input1").is(":not(.hint_text)"), "no hint class");
      strictEqual("Real Value2", $("#input2").val(), "focused");
      $("#input2").val("New Real Value2");
    }).focus(500, function() {
        $( this ).unbind( "focus" );
        $("#input1").focus();
        strictEqual('New Real Value2', $("#input2").val(), "after focus and change");
        ok($("#input1").is(":not(.hint_text)"), "no hint class");
        start();
    });
    
  });


}(jQuery));
