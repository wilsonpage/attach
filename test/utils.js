
// Alias chai.assert
var assert = chai.assert;

function simulate(type, el) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

function $(query) {
  return document.querySelector(query);
}