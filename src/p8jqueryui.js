

(function($) {

  /*
   * WIDGETS
   * FORM FIELDS
   * 
   * - Text
   * - Select
   * 
   */

  function addDirty() {
    $(this).addClass("dirty");
  }

  //creates a input element
  var p8ValueField = {
    options : {
      data : null,
      valueField : 'value',
      prefix : '',
      title : ''
    },
    _create : function() {
      this.element.addClass("p8-inputElem");
      this.element.addClass("p8-valueField");
      this.element.change(addDirty);

      var value = '';
      if(this.options.data[this.options.valueField] !== undefined) {
        value = this.options.data[this.options.valueField];
      }

      var input = $('<input />').attr('type', 'text').attr('name', this.options.prefix + '-' + this.options.valueField).attr('title', this.options.title).attr('value', value);
      //.p8InfoTip();

      this.element.append(input);

      input.p8AddHint();
      input.data('p8-inputElem-value', value);
      input.data('p8-inputElem-orgValue', value);
      input.blur(function() {
        $(this).data('p8-inputElem-value', $(this).attr('value'));
      });

    },
    initRules : function() {
      if(this.options.rules !== undefined) {
        this.element.find("input").rules("add", this.options.rules);
      }
    }
  };

  $.widget("ui.p8ValueField", p8ValueField);

  //uses a input element
  var p8ValueFieldT = {
    options : {
      data : null,
      valueField : 'value',
      prefix : '',
      title : '',
      showHint : false
    },
    _create : function() {
      var cnt = $("<span>");

      cnt.addClass("p8-inputElem");
      cnt.addClass("p8-valueField");
      cnt.change(addDirty);
      var parent = this.element.parent();
      cnt.appendTo(parent);

      this.element.appendTo(cnt);

      /*      var value = ''; 
            if( this.options.data[this.options.valueField] !== undefined )
              value = this.options.data[this.options.valueField];
      */
      this.element.attr('name', this.options.valueField).attr('title', this.options.title).
      //attr('value', value).
      p8InfoTip();

      if(this.options.showHint) {
        this.element.p8AddHint();
      }

      this.element.data('p8-inputElem-value', $(this).attr('value'));
      this.element.data('p8-inputElem-orgValue', $(this).attr('value'));
      this.element.blur(function() {
        $(this).data('p8-inputElem-value', $(this).attr('value'));
      });

      this.element.focus(function() {
        $(this).valid();
      });

      this.initRules();
    },
    initRules : function() {
      if(this.options.rules !== undefined) {
        this.element.rules("add", this.options.rules);
      }
    }
  };

  $.widget("ui.p8ValueFieldT", p8ValueFieldT);

  var p8TypeSelect = {
    options : {
      data : {},
      typeField : 'type',
      customValueField : 'value2',
      types : null,
      prefix : '',
      title : '',
      cclass : ''
    //i180nPackage : 'contactTypes'
    },
    _create : function() {
      this.element.addClass("p8-inputElem");
      this.element.addClass("p8-typeSelect");

      var value = this.options.data[this.options.typeField];
      var rvalue = this.options.data[this.options.typeField];
      if(value === 'CUSTOM') {
        value = this.options.data[this.options.customValueField];
        rvalue = this.options.data[this.options.customValueField];
      }
      else if(value === undefined) {
        //TODO: value translation        
        //value = $.i18n(this.options.i180nPackage, this.options.types[0]);
        value = this.options.types[0];
      }
      else {
        rvalue = value;
        //TODO: value translation
        //value = $.i18n(this.options.i180nPackage, value);
      }

      if(value === undefined) {
        value = "";
      }

      var types = this.options.types;
      var source = [];

      $.each(types, function(index, value) {
        //TODO: value translation
        //source.push($.i18n(that.options.i180nPackage, value));
        source.push(value);
      });

      var input = $('<input />').attr('value', value).attr('name', this.options.prefix + '-' + this.options.typeField).addClass(this.options.cclass).autocomplete({
        source : source,
        zIndex : 99,
        minLength : 0
      });
      //TODO: infotip .p8InfoTip();

      var button = $('<a/>').button({
        label : 'Open',
        text : false,
        icons : {
          primary : 'ui-icon-circle-triangle-s'
        }
      });
      button.click(function() {
        input.autocomplete("search", '');
        input.focus();
      });
      this.element.append(input).append(button);

      this.element.change(addDirty).bind('autocompletechange', addDirty).bind('autocompleteselect', addDirty).bind('autocompleteselect', function(event, selected) {
        //TODO: value translation
        //input.data('p8-inputElem-value', $.i18n(that.options.i180nPackage, selected.item.value));
        input.data('p8-inputElem-value', selected.item.value);
      });

      if(rvalue) {
        input.data('p8-inputElem-orgValue', rvalue);
        input.data('p8-inputElem-value', rvalue);
      }

      input.focus(function() {
        $(this).valid();
      }).change(function() {
        //TODO: value translation        
        //$(this).data('p8-inputElem-value', $.i18n(that.options.i180nPackage, $(this).attr('value')));
        $(this).data('p8-inputElem-value', $(this).attr('value'));
      });
    },
    initRules : function() {
      if(this.options.rules !== undefined) {
        var input = this.element.find("input");
        input.rules("add", this.options.rules);
      }

    }
  };

  $.widget("ui.p8TypeSelect", p8TypeSelect);

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
