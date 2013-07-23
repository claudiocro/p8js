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

