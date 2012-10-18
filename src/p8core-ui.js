(function($) {

  $.fn.p8SimpleGrid = function(poptions) {

    var options = jQuery.extend({
      horizontal : false,
      totalInRow : 4
    }, poptions);

    var elem = this;

    elem.addClass('p8SimpleGrid').addClass('gridded-content').css({
      'z-index' : 2
    });

    var currentCol = 0;
    var currentRow = 0;
    var currentColE = null;
    var classPrefix = (options.horizontal === false) ? "col" : "row";
    return this.children().each(function() {

      if(currentRow === 0) {
        currentColE = $('<div></div>').addClass("grid").addClass(classPrefix).addClass(classPrefix + '-' + currentCol);
      }
      currentColE.append($(this));

      elem.append(currentColE);
      if(currentRow === options.totalInRow - 1) {
        currentCol++;
        currentRow = 0;
      }
      else {
        currentRow++;
      }
    });
  };

}(jQuery));

(function($) {

  /*
   * JQUERY FUNCTION
   * CREATE hint text based on the title for an input field
   * 
   */

  $.fn.p8AddHint = function() {
    // applies a text hint to the text input field by using the input's title attribute
    return this.each(function() {
      var selfElem = jQuery(this);
      var title = this.title;

      if(selfElem.val() === '') {
        selfElem.addClass('hint_text');
        selfElem.val(title);
      }

      selfElem.focus(function() {
        if(selfElem.val() === title) {
          selfElem.removeClass('hint_text');
          selfElem.val('');
        }
      });

      selfElem.blur(function() {
        if(selfElem.val() === '') {
          selfElem.addClass('hint_text');
          selfElem.val(title);
        }
      });
    });
  };

}(jQuery));

(function($) {

  /*
   * JQUERY FUNCTION
   * CREATE a two column layout for a MultiContactInfoEditor
   * 
   */

  $.fn.p8uiTwoColPanel = function(poptions) {

    var options = jQuery.extend({
      data : null,
      valueFields : [],
      prefix : '',
      innerClass : 'form-row-inner'
    }, poptions);

    return this.each(function() {

      var selfElem = $(this);

      var innerRow = null;
      var length = options.valueFields.length;
      var colId = 0;
      for( var i = 0; i < length; i++) {

        var valueField = options.valueFields[i];
        if(i % 2 === 0) {
          colId = 0;
          innerRow = $('<div class="' + options.innerClass + ' edit p8TwoCol-row-' + i / 2 + ' ' + length + '" />');
          if(i === 0) {
            innerRow.addClass("p8TwoCol-row-first");
          }

          selfElem.append($('<div class="' + options.innerClass + '-wrap" />').append(innerRow));
        }

        if(i === length - 1 && innerRow !== null) {
          innerRow.addClass("p8TwoCol-row-last");
        }

        if(valueField.type === "text") {
          innerRow.append($('<span />').addClass('col-' + colId).p8ValueField({
            data : options.data,
            valueField : valueField.value,
            prefix : options.prefix,
            title : valueField.title,
            rules : valueField.rules
          }));
        }
        else if(valueField.type === "select") {
          innerRow.append($("<span />").addClass('col-' + colId).p8TypeSelect({
            types : valueField.types,
            data : options.data,
            typeField : valueField.value,
            customValueField : valueField.customValueField,
            prefix : options.prefix,
            title : valueField.title,
            //i180nPackage : valueField.i180nPackage,
            rules : {
              minlength : 2,
              required : true,
              messages : {
                minlength : "Please, at least {0} characters are necessary"
              }
            }
          }));
        }
        colId++;
      }

      return $(this);
    });
  };

}(jQuery));

(function($) {

  /*
   * JQUERY FUNCTION
   * CREATE panel with a singlefiled and ok / cancel buttons
   * 
   */

  $.fn.p8uiSimpleSearchPanel = function(poptions) {

    var options = jQuery.extend({
      okFunc : null,
      cancelFunc : null,
      cancelText : 'Cancel',
      contentTop : null,
      contentRight : null,
      fieldName : 'search',
      fieldTitle : 'Search'
    }, poptions);

    return this.each(function() {
      var selfElem = $(this);

      if(options.contentTop !== null) {
        var top = $('<div class="p8-simpleSearchPanel-top" />').append(options.contentTop);
        selfElem.append(top);
      }

      var searchField = $('<input />').attr('type', 'text').attr('name', options.fieldName).attr('title', options.fieldTitle);

      searchField.keypress(function(e) {
        var c = e.which ? e.which : e.keyCode;
        if(c === 13) {
          if($.isFunction(options.okFunc)) {
            options.okFunc.call(this);
          }
        }
      });

      var input = $('<div class="p8-simpleSearchPanel-field" />');
      if(options.contentRight !== null) {
        input.append(options.contentRight);
      }

      input.append(searchField);
      selfElem.append(input);

      if(options.buttons !== null) {
        var buttons = $('<div class="p8-simpleSearchPanel-button" />').append($('<button />').html(options.cancelText).button().click(function() {

        }));
        selfElem.append(buttons);
      }

    });
  };

}(jQuery));