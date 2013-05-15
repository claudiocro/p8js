/*!
 * p8js - v0.4.4 -
 * plus8.ch
 * 
 * Copyright (c) 2013, Claudio Romano
 * Licensed Apache-2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Date: 2013-05-15 11:21:09 +0200
 */


/* 
 * (c) http://blog.toppingdesign.com/2009/08/13/fast-rfc-3339-date-processing-in-javascript/
 */
Date.prototype.p8fromJSON = function(dString) {
  var utcOffset, offsetSplitChar, offsetFieldIdentifier;
  var offsetMultiplier = 1;
  var dateTime = dString.split("T");
  var date = dateTime[0].split("-");
  var time = dateTime[1].split(":");
  var offsetField = time[time.length - 1];
  var offsetString;
  offsetFieldIdentifier = offsetField.charAt(offsetField.length - 1);
  if(offsetFieldIdentifier === "Z") {
    utcOffset = 0;
    time[time.length - 1] = offsetField.substr(0, offsetField.length - 2);
  }
  else {
    if(offsetField[offsetField.length - 1].indexOf("+") !== -1) {
      offsetSplitChar = "+";
      offsetMultiplier = 1;
    }
    else {
      offsetSplitChar = "-";
      offsetMultiplier = -1;
    }
    offsetString = offsetField.split(offsetSplitChar);
    time[time.length - 1] = offsetString[0];
    offsetString = offsetString[1].split(":");
    utcOffset = (offsetString[0] * 60) + offsetString[1];
    utcOffset = utcOffset * 60 * 1000;
  }

  this.setTime(Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], time[2]) + (utcOffset * offsetMultiplier));
  return this;
};



/*
 * 
 * (c) http://cbas.pandion.im/2009/10/generating-rfc-3339-timestamps-in.html
 */
Date.prototype.p8toJSON = function() {
  var d = this;
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  function pad3(n) {
    if(n < 10) {
       return '00' + n;
    } else if(n < 100) {
      return '0' + n;
    } else {
      return n;
    }
  }

  return d.getUTCFullYear() + '-' + 
    pad(d.getUTCMonth() + 1) + '-' + 
    pad(d.getUTCDate()) + 'T' + 
    pad(d.getUTCHours()) + ':' + 
    pad(d.getUTCMinutes()) + ':' + 
    pad(d.getUTCSeconds()) + '.' +
    pad3(d.getUTCMilliseconds()) +'Z';
};


//TODO: intorduce something like date.js
Date.prototype.p8DeDate = function(time) {
  var d = this;
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  function pad3(n) {
    if(n < 10) {
       return '00' + n;
    } else if(n < 100) {
      return '0' + n;
    } else {
      return n;
    }
  }

  var fdate =   pad(d.getUTCDate()) + '.' + 
    pad(d.getUTCMonth() + 1) + '.' +
    d.getUTCFullYear();
  
  if(time === true) {
    fdate += " " + pad(d.getUTCHours()) + ':' + 
    pad(d.getUTCMinutes());
  }
  
  return fdate;
};


/*
 *  p8 core  0.3.1
 * 
 * Depends:
 * jquery
 */

(function($) {
  $.extend({
    nl2br : function(text) {
      if (typeof (text) === "string") {
        return text.replace(/(\r\n)|(\n\r)|\r|\n/g, "<br />");
      } else {
        return text;
      }
    }

  });
}(jQuery));

(function($) {
  $.extend({
    getUrlVars : function(loc) {
      if (loc === undefined) {
        loc = window.location.href;
      }

      var vars = [], hash;
      var hashes = loc.slice(loc.indexOf('?') + 1).split('&');
      for ( var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    getUrlVar : function(name, loc) {
      return $.getUrlVars(loc)[name];
    }
  });
}(jQuery));

(function($) {
  $.extend({
    scaleSize : function(maxW, maxH, currW, currH, roundResult) {
      var ratio = currH / currW;
      var maxRatio = maxH / maxW;

      if (currW >= maxW && ratio <= maxRatio) {
        currW = maxW;
        currH = currW * ratio;
      } else if (currH >= maxH) {
        currH = maxH;
        currW = currH / ratio;
      }
      if (roundResult !== true) {
        return [ currW, currH ];
      } else {
        return [ Math.round(currW), Math.round(currH) ];
      }
    }
  });
}(jQuery));

(function($) {
  $.extend({
    // remove quotes and wrapping url()
    extractUrl : function extractUrl(input) {
      // return input.replace(/"/g, "").replace(/url\(|\)$/ig, "");
      var rx = /url\(["']?([^'")]+)['"]?\)/;
      return input.replace(rx, '$1');
    }
  });
}(jQuery));

(function($) {
  $.extend({
    hex2a : function(hex) {
      var str = '';
      for ( var i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    },

    asc2h : function(pStr) {
      var tempstr = '';
      for ( var a = 0; a < pStr.length; a = a + 1) {
        tempstr = tempstr + pStr.charCodeAt(a).toString(16);
      }
      return tempstr;
    }
  });
}(jQuery));

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
(function($) {

  $.fn.p8InfoTip = function(psettings) {

    function InfoTip(elem, settings) {
      var infoTip = this;
      var isShowing = false;

      var tinyTip = $('<div class="' + settings.tipClass + '"><div class="top" style="text-align:' + settings.topAlign + ';"><img src="' + settings.peackImage + '"></div><div class="content" style="width:' + settings.width + '"></div></div>');
      tinyTip.hide();
      $('body').append(tinyTip);

      if(settings.removeOnFocusLost) {
        elem.blur(function() {
          setTimeout(function() {
            if(settings.removeAfterIfFocus || !elem.is(':focus')) {
              hide();
            }

          }, settings.removeAfter);
        });
      }

      if(settings.removeOnClickOutside) {
        //Only one infoTip at time ...
        if($('#p8-infoTip-overlay').size() === 0) {
          var overlay = $('<div id="p8-infoTip-overlay"/>').css({
            'opacity' : 0,
            'z-index' : settings.zindex - 1
          }).hide();

          $('body').append(overlay);
        }

        $('#p8-infoTip-overlay').click(function() {
          hide();
          return false;
        });

      }

      if(settings.content !== undefined) {
        $('.content', tinyTip).append(settings.content);
      }

      function _show() {

        if(isShowing === true) {
          return;
        }

        isShowing = true;
        var xOffset = 0;
        if(settings.topAlign === 'center') {
          xOffset = (tinyTip.width() / 2) - (elem.width() / 2);
        }

        var pos = elem.offset();
        var nPos = pos;

        // Add the offsets to the tooltip position
        nPos.top = pos.top + elem.height() - 10;
        nPos.left = pos.left - xOffset;

        // Make sure that the tooltip has absolute positioning and a high z-index, 
        // then place it at the correct spot and fade it in.
        if(settings.removeOnClickOutside) {
          $('#p8-infoTip-overlay').css({
            'width' : $(document).width(),
            'height' : $(document).height()
          }).show();
        }

        tinyTip.css('position', 'absolute').css('z-index', settings.zindex).css('display', 'block').css('opacity', 0.5);
        tinyTip.css(nPos);
        tinyTip.animate({
          opacity : settings.opacity,
          top : nPos.top + 15
        }, {
          queue : false,
          duration : settings.speed
        });
      }

      function show(supCont) {

        if(supCont !== undefined) {
          settings.content = supCont;
          $('.content', tinyTip).empty().append(supCont);
        }

        if(settings.content === undefined) {
          return;
        }

        _show();

        if(settings.removeAfter > 0) {
          setTimeout(function() {

            if(settings.removeAfterIfFocus || !elem.is(':focus')) {
              hide();
            }

          }, settings.removeAfter);
        }

        if(settings.showTrigger !== undefined) {
          settings.showTrigger.call();
        }
      }

      function hide() {
        if(isShowing) {
          isShowing = false;

          if(settings.removeOnClickOutside) {
            $('#p8-infoTip-overlay').hide();
          }

          tinyTip.animate({
            opacity : 0,
            top : '+=10'
          }, settings.hideSpeed, function() {
            tinyTip.css('display', 'none');
          });

          if(settings.hideTrigger !== undefined) {
            settings.hideTrigger.call();
          }
        }
      }

      function destroy() {

        if(settings.removeOnClickOutside) {
          $('#p8-infoTip-overlay').hide();
        }

        tinyTip.fadeOut(settings.speed, function() {
          $(this).remove();
        });
        elem.removeData('p8InfoTip', null);
      }

      $.extend(infoTip, {
        show : function(text) {
          show(text);
        },
        hide : function() {
          hide();
        },
        isShowing : function() {
          return isShowing;
        },
        destroy : function() {
          destroy();
        }
      });
    }

    psettings = $.extend({}, $.fn.p8InfoTip.defaults, psettings);

    this.each(function() {
      var elem = $(this);
      var p8infoTip = elem.data('p8InfoTip');
      if(!p8infoTip) {
        p8infoTip = new InfoTip(elem, psettings);
        elem.data('p8InfoTip', p8infoTip);
      }
    });

    return this;
  };

  $.fn.p8InfoTip.defaults = {
    'tipClass' : 'error-tip',
    'opacity' : 0.8,
    'speed' : 375,
    'hideSpeed' : 125,
    'width' : '150px',
    'removeAfter' : 1300, //removes the infoTip after a period of time
    'removeAfterIfFocus' : false, //remove it even it is focused
    'removeOnFocusLost' : true, //remove if the source element loses the focus
    'removeOnClickOutside' : true, //removes if the someone clicks outside the infoTip
    'zindex' : 2005,
    'content' : undefined,
    'peackImage' : 'res/images/error-tip_top.png',
    'topAlign' : 'center', //left,center,right
    'hideTrigger' : undefined,
    'showTrigger' : undefined
  };

}(jQuery));

(function( window, undefined ) {
  
  
  
  function Browseris() {
    var a = navigator.userAgent.toLowerCase();
    this.osver = 1;
    if(a) {
      var g = a.substring(a.indexOf("windows ") + 11);
      this.osver = parseFloat(g);
    }
    this.major = parseInt(navigator.appVersion,10);
    this.nav = a.indexOf("mozilla") !== -1 && (a.indexOf("spoofer") === -1 && a.indexOf("compatible") === -1);
    this.nav6 = this.nav && (this.major === 5 || this.major === "5");
    this.nav6up = this.nav && this.major >= 5;
    this.nav7up = false;
    if(this.nav6up) {
      var b = a.indexOf("netscape/");
      if(b >= 0) {
        this.nav7up = parseInt(a.substring(b + 9), 10) >= 7;
      }
    }
    this.ie = a.indexOf("msie") !== -1;
    this.aol = this.ie && a.indexOf(" aol ") !== -1;
    if(this.ie) {
      var e = a.substring(a.indexOf("msie ") + 5);
      this.iever = parseInt(e, 10);
      this.verIEFull = parseFloat(e);
    }
    else {
      this.iever = 0;
    }
    
    this.ie4up = this.ie && this.major >= 4;
    this.ie5up = this.ie && this.iever >= 5;
    this.ie55up = this.ie && this.verIEFull >= 5.5;
    this.ie6up = this.ie && this.iever >= 6;
    this.ie7down = this.ie && this.iever <= 7;
    this.ie7up = this.ie && this.iever >= 7;
    this.ie8standard = this.ie && document.documentMode && (document.documentMode === 8 || document.documentMode === "8");
    this.winnt = a.indexOf("winnt") !== -1 || a.indexOf("windows nt") !==-1;
    this.win32 = this.major >= 4 && navigator.platform === "Win32" || a.indexOf("win32") !== -1 || a.indexOf("32bit") !== -1;
    this.win64bit = a.indexOf("win64") !== -1;
    this.win = this.winnt || this.win32 || this.win64bit;
    this.mac = a.indexOf("mac") !== -1;
    this.w3c = this.nav6up;
    this.safari = a.indexOf("webkit") !== -1;
    this.safari125up = false;
    this.safari3up = false;

    if(this.safari && this.major >= 5) {
      var bb = a.indexOf("webkit/");
      if(bb >= 0) {
        this.safari125up = parseInt(a.substring(bb + 7),10) >= 125;
      }
      var f = a.indexOf("version/");
      if(f >= 0) {
        this.safari3up = parseInt(a.substring(f + 8),10) >= 3;
      }
    }

    this.firefox = this.nav && a.indexOf("firefox") !== -1;
    this.firefox3up = false;
    this.firefox36up = false;
    if(this.firefox && this.major >= 5) {
      var d = a.indexOf("firefox/");
      if(d >= 0) {
        var c = a.substring(d + 8);
        this.firefox3up = parseInt(c,10) >= 3;
        this.firefox36up = parseFloat(c,10) >= 3.6;
      }
    }
  }
  

  var browseris = new Browseris(),
    v_stsOpenDoc2 = null, 
    v_strStsOpenDoc2 = null;
  
  var webedit = function(id) {
    var d = stsOpenEnsureEx2('SharePoint.OpenDocuments.3');
    if(d != null) {
      d.EditDocument(id);
      return true;
    }
    return false;
  };
  
  var stsOpenEnsureEx2 = function(a) {
    if(v_stsOpenDoc2 === null || v_strStsOpenDoc2 !== a) {
      v_stsOpenDoc2 = null;
      v_strStsOpenDoc2 = null;
      if(window.ActiveXObject) {
        try {
          v_stsOpenDoc2 = new ActiveXObject(a);
          v_strStsOpenDoc2 = a;
        } catch(c) {
          v_stsOpenDoc2 = null;
          v_strStsOpenDoc2 = null;
        }
      }
      else if(isSupportedMacBrowser() && a.indexOf("SharePoint.OpenDocuments") >= 0) {
        var mm = createMacPlugin();
        if(mm != null) {
          v_stsOpenDoc2 = mm;
          v_strStsOpenDoc2 = "SharePoint.MacPlugin";
        }
      }
      else if(isSupportedFirefoxOnWin() && a.indexOf("SharePoint.OpenDocuments") >= 0) {
        var ff = createFirefoxOnWindowsPlugin();
        if(ff != null) {
          v_stsOpenDoc2 = ff;
          v_strStsOpenDoc2 = "SharePoint.FFWinPlugin";
        }
      }
    }
    
    return v_stsOpenDoc2;
  };
  
  var isSupportedFirefoxOnWin = function() {
    return (browseris.winnt || browseris.win32 || browseris.win64bit) && browseris.firefox3up;
  };
  
  var isFirefoxOnWindowsPluginInstalled = function() {
    return navigator.mimeTypes && navigator.mimeTypes["application/x-sharepoint"] && navigator.mimeTypes["application/x-sharepoint"].enabledPlugin;
  };
  
  var createFirefoxOnWindowsPlugin = function() {
    var b = null;
    if(isSupportedFirefoxOnWin()) {
      try {
        b = document.getElementById("winFirefoxPlugin");
        if(!b && isFirefoxOnWindowsPluginInstalled()) {
          var a = document.createElement("object");
          a.id = "winFirefoxPlugin";
          a.type = "application/x-sharepoint";
          a.width = 0;
          a.height = 0;
          a.style.setProperty("visibility", "hidden", "");
          document.body.appendChild(a);
          b = document.getElementById("winFirefoxPlugin");
        }
      } catch(c) {
        b = null;
      }
    }
    return b;
  };

  var isSupportedMacBrowser = function() {
    return browseris.mac && (browseris.firefox3up || browseris.safari3up);
  };
  
  var isBrowserPluginInstalled = function(a) {
    return navigator.mimeTypes && navigator.mimeTypes[a] && navigator.mimeTypes[a].enabledPlugin;
  };
  
  var isMacPluginInstalled = function() {
    var a = isBrowserPluginInstalled("application/x-sharepoint-webkit"), b = isBrowserPluginInstalled("application/x-sharepoint");
    if(browseris.safari3up && a) {
      return true;
    }

    return b;
  };

  var createMacPlugin = function() {
    var b = null;
    if(isSupportedMacBrowser()) {
      b = document.getElementById("macSharePointPlugin");
      if(b == null && isMacPluginInstalled()) {
        var c = null;
        if(browseris.safari3up && isBrowserPluginInstalled("application/x-sharepoint-webkit")) {
          c = "application/x-sharepoint-webkit";
        } else {
          c = "application/x-sharepoint";
        }
        var a = document.createElement("object");
        a.id = "macSharePointPlugin";
        a.type = c;
        a.width = 0;
        a.height = 0;
        a.style.setProperty("visibility", "hidden", "");
        document.body.appendChild(a);
        b = document.getElementById("macSharePointPlugin");
      }
    }
    return b;
  };
  

  window.p8webEdit = webedit;
})( window );  
  






