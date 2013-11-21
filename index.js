;(function() {
'use strict';

/**
 * Namespace to store
 * references under on root
 */

var ns = '_delegate';

/**
 * Normalize `matchesSelector`
 */

var proto = Element.prototype;
var matches = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Handles Backbone style
 * shorthand event binding.
 *
 * Example:
 *
 *   delegate(myElement, {
 *     'click .foo': onFooClick,
 *     'click .bar': onBarClick
 *   });
 *
 * @param  {element} root
 * @param  {Object} config
 * @param  {Object} ctx
 */
function delegate(root, config, ctx) {
  var selector;
  var parts;
  var type;
  var key;
  var fn;

  for (key in config) {
    parts = key.split(' ');
    selector = parts[1];
    type = parts[0];
    fn = config[key];

    delegate.on(root, type, selector, fn, ctx);
  }
}

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
 * @param  {String}   selector (optional)
 * @param  {Function} fn
 * @param  {Object}   ctx (optional)
 */
delegate.on = function(root, type, selector, fn, ctx) {

  // `selector` is optional
  if (typeof selector === 'function') {
    ctx = fn;
    fn = selector;
    selector = 'null';
  }

  var store = getStore(root);
  var master = store.master[type];
  var delegates = store.delegates[type] = (store.delegates[type] || {});

  // Add the function to the delegates
  delegates[selector] = fn;

  // Only one master event listener
  // is needed per event type.
  if (master) return;

  // Add the master callbak to the
  // root node and to the store.
  master = store.master[type] = callback;
  root.addEventListener(type, master);

  /**
   * The master callback passed
   * to `addEventListener`.
   *
   * @param  {Event}   event
   */
  function callback(event) {
    var el = event.target;
    var selector;
    var matched;
    var out;
    var fn;

    // Walk up the DOM tree
    // until we hit the root
    while (el) {

      // Loop over each selector
      // bound to this event type.
      for (selector in delegates) {
        fn = delegates[selector];

        // There are two types of match. A
        // 'null' selector at the root node,
        // or a selector match on the current el.
        matched = (el === root && selector === 'null')
          || matches.call(el, selector);

        if (matched) {
          out = fn.call(ctx || el, event, el);

          // Stop propagation if the
          // user returns false from the
          // callback. Ideally we would
          // use .stopPropagation, but I
          // don't know of any way to detect
          // if this has been called.
          if (out === false) return;
        }
      }

      // Don't go any higher
      // than the root element.
      if (el == root) break;

      // Move on up!
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
 * @param  {String} type (optional)
 * @param  {String} selector (optional)
 */
delegate.off = function(root, type, selector) {
  var store = getStore(root);
  var master = store.master[type];
  var delegates = store.delegates[type];

  // Remove just one
  if (type && selector) {
    delete delegates[selector];
  }

  // Remove all of type
  else if (type) {
    delete store.delegates[type];
  }

  // Remove all
  else {
    for (type in store.master) {
      delegate.off(root, type);
    }
  }

  // If there aren't any callbacks
  // of this type left, remove the master.
  if (isEmpty(store.delegates[type])) {
    root.removeEventListener(type, master);
    delete store.master[type];
  }
};

/**
 * Gets the reference store
 * attached to the given node.
 *
 * If one is not found, we
 * create a fresh one.
 *
 * @param  {Element} el
 * @return {Object}
 */
function getStore(el) {
  return el[ns] || createStore(el);
}

/**
 * Creates a fresh reference
 * store on the given element.
 *
 * @param  {Element} el
 * @return {Object}
 */
function createStore(el) {
  return el[ns] = { master: {}, delegates: {} };
}

/**
 * Checks if the given
 * element has no keys.
 *
 * @param  {Object}  ob
 * @return {Boolean}
 */
function isEmpty(ob) {
  for (var key in ob) return false;
  return true;
}

/**
 * Expose 'delegate' (UMD)
 */

if (typeof exports === "object") {
  module.exports = delegate;
} else if (typeof define === "function" && define.amd) {
  define(function(){ return delegate; });
} else {
  window['delegate'] = delegate;
}

})();