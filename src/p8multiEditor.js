(function($) {

  /*
   * HELPER METHOD
   * CREATE MultiContactInfoEditor widget
   * 
   */

  /**
   * Maps single value field with a type from the options in p8uiCreateTypeValueMultiEditor 
   * 
   */
  function mapSingleTypedValuesFields(options) {
    var valueFields = [];
    var valueField;
    
    if (options.typeField !== null) {
      valueField = {};
      valueField.value = options.typeField;
      valueField.customValueField = options.customValueField;
      valueField.types = options.types;
      valueField.title = $.i18n(options.i180nPackage, options.group);
      valueField.i180nPackage = options.i180nPackage;
      valueField.type = "select";
      valueFields.push(valueField);
    }

    //var prop = null;
    for (var prop in options.mapping) {
      valueField = {};
      valueField.value = options.mapping[prop];
      valueField.title = $.i18n(options.i180nPackage, options.group + '-' + prop);
      valueField.type = "text";
      valueField.rules = options.rules[prop];
      valueFields.push(valueField);
    }
    options.valueFields = valueFields;

    //  $.extend (options, contactInfoEditorParams);

  }

  /**
   * Create a type with value editor based on the provided options
   * 
   */
  $.fn.p8uiCreateTypeValueMultiEditor = function(poptions) {

    var options = jQuery.extend({
      valueField : "value",
      i180nPackage : '',
      mapping : null,
      typeField : null,
      customValueField : null,
      types : null,
      newCount : 0,
      hiddenNewData : {},
      rules: {}
    }, poptions);

    if (options.valueField !== null && options.mapping === null) {
      options.mapping = {
        VALUE_FIELD : options.valueField
      };
    }

    mapSingleTypedValuesFields(options);

    return this.each(function() {
      $(this).p8uiMultiEditor(options);
      return $(this);
    });
  };

}(jQuery));

(function($) {

  /**
   * Returns the id attribute from the provided parameter
   * 
   */
  var uniqueIdFunc = function(editor) {
    return editor.attr('id');
  };

  /* 
   * WIDGET
   * MULTI CONTACT INFO EDITOR
   * 
   */

  /**
   * 
   * 
   */
  var p8uiMultiEditor = {
    options : {
      group : '',
      title : '',
      innerSel : '.form-row-inner',
      newCount : 0,
      newFunc : null,
      allowNew : true,
      initFunc : null,
      hiddenNewData : {}, //should be used by the newFunc
      uniqueIdFunc : uniqueIdFunc
    },

    _create : function() {
      var self = this;
      var selfElem = self.element;

      if (this.options.newFunc !== null) {
        $('<a />').button({
          text : false,
          label : 'Add',
          icons : {
            primary : 'ui-icon-plus'
          }
        }).addClass('add').hide().button().click(function() {
          self.addNew(true);
        }).hide().appendTo(selfElem);
      }

      this.options.title = this.options.group;

      //    selfElem.prepend($('<br/>'));

      self.focused = false;
    },
    _decorateEditor : function(editor) {
      var self = this;

      editor.addClass("form-row");

      var editorWrap = editor.find(this.options.innerSel + "-wrap");
      editorWrap.prepend($('<div><br /></div>').addClass('action-panel'));
      if ($.isFunction(this.options.newFunc)) {

        if (editor.hasClass("init-new")) {
          return;
        }

        var delButton = $('<a />').button({
          text : false,
          label : 'Delete',
          icons : {
            primary : 'ui-icon-minus'
          }
        }).addClass('delete').click(function() {
          var remove = false;
          if (editor.hasClass('new')) {
            remove = true;
          } else {
            editor.addClass('deleted');
          }

          var scrollApi = self.element.parents(".p8-scroll").data('jsp');
          if (self.element.find('.form-row').not(':hidden').size() > 1) {
            var editorHeight = editor.height() + 2; //TODO: +2 is the padding of the parent div ...
            var containerHeight = self.element.parents(".jspContainer:first").height();
            var jspPane = self.element.parents(".jspPane:first");
            var paneHeight = jspPane.height() + jspPane.position().top;

            if ((paneHeight - editorHeight) < containerHeight) {
              scrollApi.scrollByY(editorHeight * -1, true);
            }
          }

          editor.animate({
            height : "toggle",
            opacity : "toggle"
          }, {
            duration : 600,
            easing : 'easeInBack',
            complete : function() {

              if (remove) {
                self.element.find('.add').hide().appendTo(self.element);
                $(this).remove();
              }

              if (self.element.find('.form-row').not(':hidden').size() === 0) {
                self.addNew(true);
              } else {
                self.updateAddButton();
                scrollApi.reinitialise();
              }
            }
          });

          return true;
        });

        editor.find(this.options.innerSel + '-wrap:last').find('.action-panel').prepend(delButton);
        editor.find('input').focus(function() {
          clearTimeout(self.blurTimer);
          if (!self.focused) {
            self.focused = true;
            self._trigger('focusgained', null, {
              item : this
            });
          }
        });

        editor.find('input').blur(function() {
          clearTimeout(self.blurTimer);
          self.focused = false;
          self.blurTimer = setTimeout(function() {
            if (self.focused !== true) {
              self._trigger('focuslost');
            }
          }, 50);
        });

        this.element.trigger('focus');

        //      $('.ui-autocomplete').jScrollPane();
      }

      for (var prop in this.options.hiddenNewData) {
        editorWrap.append($("<input/>").attr('type', 'hidden').attr('name', this.options.uniqueIdFunc.call(this, editor) + '-' + prop).attr('value', this.options.hiddenNewData[prop]));
      }

    },
    load : function(contactInfos) {
      var newFunc = this.options.newFunc;
      if ($.isFunction(newFunc)) {
        for ( var i = 0, len = contactInfos.length; i < len; i++) {
          var editor = newFunc.call(this, contactInfos[i]);
          this._decorateEditor(editor);
          this.element.append(editor);

          $(".p8-typeSelect", editor).p8TypeSelect("initRules");
          $(".p8-valueField", editor).p8ValueField("initRules");
        }

      }

      if (contactInfos.length === 0) {
        this.addNew();
      }

      this.updateAddButton();
    },
    addNew : function(animate) {
      if (this.options.allowNew === false) {
        return;
      }

      var that = this;

      var initFunc = this.options.initFunc;
      var newFunc = this.options.newFunc;
      if ($.isFunction(initFunc) && this.element.find(".init-new").length === 0) {
        this.addInit(animate);
      }
      else if ($.isFunction(newFunc)) {
        this.element.find(".init-new").hide(200, function() {
          var addButton = that.element.find('.add');
          addButton.hide();
          addButton.appendTo(that.element);
          $(this).remove();
        });

        var editor = newFunc.call(this);

        this.options.newCount = this.options.newCount + 1;
        editor.addClass('new');
        this._decorateEditor(editor);
        editor.css('opacity', 1);
        this.element.append(editor);
        this.updateAddButton();

        $(".p8-typeSelect", editor).p8TypeSelect("initRules");
        //$(".p8-valueField", editor).p8ValueField("initRules");

        if (animate) {
          editor.css('opacity', 0);
          var scrollPaneElem = this.element.parents(".p8-scroll").filter(':first');
          if (scrollPaneElem.length > 0) {
            var scrollApi = scrollPaneElem.data('jsp');
            var elemTop = editor.position().top;
            var elemHeight = (editor.height() + 2);
            scrollApi.reinitialise();
            if (elemTop + elemHeight > scrollPaneElem.height()) {
              scrollApi.scrollByY(elemHeight, true);
            }
          }
        }

        editor.hide();
        editor.css('opacity', 1);
        if (animate === undefined) {
          editor.show();
        }
        else {
          editor.animate({
            opacity : 'toggle',
            height : 'toggle'
          }, {
            duration : 600,
            easing : 'easeOutBack',
            complete : function() {
              that.updateAddButton();
            }
          });
        }

      }

    },
    addInit : function(animate) {
      var initFunc = this.options.initFunc;
      if ($.isFunction(initFunc)) {
        var editor = initFunc.call(this);

        this.options.newCount = this.options.newCount + 1;
        editor.addClass('init-new');
        this._decorateEditor(editor);
        editor.css('opacity', 1);
        this.element.append(editor);
        this.updateAddButton();

        if (animate) {
          var scrollPaneElem = this.element.parents(".p8-scroll").filter(':first');
          if (scrollPaneElem.length > 0) {
            var scrollApi = scrollPaneElem.data('jsp');
            var elemTop = editor.position().top;
            var elemHeight = (editor.height() + 2);
            scrollApi.reinitialise();
            if (elemTop + elemHeight > scrollPaneElem.height()) {
              scrollApi.scrollByY(elemHeight, true);
            }
          }
        }

        editor.hide();
        editor.css('opacity', 1);
        if (animate === undefined) {
          editor.show();

        }
        else {
          editor.animate({
            opacity : 'toggle',
            height : 'toggle'
          }, {
            duration : 600,
            easing : 'easeOutBack'
          });
        }

      }

    },

    updateAddButton : function() {
      this.element.find('.form-row').removeClass('last').removeClass('first');

      if (this.element.find('.form-row').not(":hidden").length === 1) {
        this.element.find('.form-row').not(":hidden").addClass('first').addClass('last');
      }
      else {
        this.element.find('.form-row').not(":hidden").first().addClass('first');
        this.element.find('.form-row').not(":hidden").last().addClass('last');
      }

      this.element.find(this.options.innerSel + "-wrap").removeClass('last').removeClass('first');
      if (this.element.find(this.options.innerSel + "-wrap").not(":hidden").length === 1) {
        this.element.find(this.options.innerSel + "-wrap").not(":hidden").addClass('first').addClass('last');
      }
      else {
        this.element.find(this.options.innerSel + "-wrap").not(":hidden").first().addClass('first');
        this.element.find(this.options.innerSel + "-wrap").not(":hidden").last().addClass('last');
      }

      if (this.options.newFunc !== null) {
        //appends to the last
        //var addButton = this.element.find('.add').css('display','inline-block');
        //this.element.filter(':not(.form-row:hidden)').find('.form-row-inner:last').find('.action-panel').prepend(addButton);

        //appends to .init-new
        if (this.element.find('.init-new').length > 0) {
          var addButton = this.element.find('.add');
          addButton.css('display', 'inline-block');
          this.element.find('.init-new').find('.action-panel').prepend(addButton);
        }

      }
    }
  };

  $.widget("ui.p8uiMultiEditor", p8uiMultiEditor);

}(jQuery));