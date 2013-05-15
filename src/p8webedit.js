
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
  






