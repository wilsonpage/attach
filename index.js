
/**
 * Delegate
 *
 * @author Wilson Page
 */

;(function() {

  'use strict';

  /**
   * Namespace to store
   * references under on root
   */

  var ns = '_delegate';

  /**
   * Normalize matchesSelector
   */

  var proto = Element.prototype;
  var matches = proto.matchesSelector
    || proto.webkitMatchesSelector
    || proto.mozMatchesSelector
    || proto.msMatchesSelector
    || proto.oMatchesSelector;

  /**
   * Bind an event listener
   * to the given element.
   *
   * Example:
   *
   *   delegate(myEl, 'click', '.my-class', function(event, el) {
   *     // Do stuff
   *   });
   *
   * @param  {Element}  root
   * @param  {String}   type
   * @param  {String}   selector
   * @param  {Function} fn
   * @param  {Object}   ctx
   */
  function delegate(root, type, selector, fn, ctx) {
    var store = root[ns] = root[ns] || {};
    store[type] = store[type] || {};

    root.addEventListener(type, callback);
    store[type][selector] = callback;

    function callback(e) {
      var el = e.target;
      while (el !== root) {
        if (matches.call(el, selector)) fn.call(ctx || el, e, el);
        el = el.parentNode;
      }
    }
  }

  /**
   * Unbind an event delegate
   * from the given root element.
   *
   * If no selector if given, all
   * callbacks for the given event
   * type are removed.
   *
   * Example:
   *
   *   // Remove one
   *   delegate.off(myEl, 'click', '.my-class');
   *
   *   // Remove all
   *   delegate.off(myEl, 'click');
   *
   * @param  {Element} root
   * @param  {String} type
   * @param  {String} selector
   */
  delegate.off = function(root, type, selector) {
    var store = root[ns] = root[ns] || {};
    var callbacks;
    var callback;

    if (type && selector) {
      callback = store[type][selector];
      root.removeEventListener(type, callback);
    } else if (type) {
      callbacks = store[type];
      for (var key in callbacks) {
        root.removeEventListener(type, callbacks[key]);
      }
    }
  };

  /**
   * Expose 'Delegate'
   */

  if (typeof exports === "object") {
    module.exports = delegate;
  } else if (typeof define === "function" && define.amd) {
    define(function(){ return delegate; });
  } else {
    window['delegate'] = delegate;
  }
})();