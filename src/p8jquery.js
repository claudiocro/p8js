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
