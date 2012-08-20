/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  module('jQuery.p8InfoTip');

  test('constuction', 4, function() {
    
    $("#input1").p8InfoTip();
    $("#input2").p8InfoTip();
    $("#input3").p8InfoTip({'tipClass': 'info-tip'});
    
    
    equal(1, $("#p8-infoTip-overlay").size(), "only one overlay");
    equal(2, $(".error-tip").size(), "class counts count");
    equal(1, $(".info-tip").size(), "class counts count");
    deepEqual('object', typeof($("#input1").data('p8InfoTip')), "p8InfoTip class in data");
    
    
    
  });

  
}(jQuery));
