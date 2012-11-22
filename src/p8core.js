
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

