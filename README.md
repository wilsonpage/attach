# attach [![Build Status](https://travis-ci.org/wilsonpage/attach.png?branch=master)](https://travis-ci.org/wilsonpage/attach)

A small and simple event (and delegate event) binding library.

Attach is designed for use in modern browser enviroments, and required `matchesSelector` and `addEventListener`. If you are targeting low-end browsers, you will need to include polyfills for these methods.

```js
attach.on(element, 'click', '.child', function(){});

// ...later

attach.off(element, 'click', '.child');
```

## API

### attach.on(element, eventType[, selector], callback[, context])

Binds a callback to a given event pattern.

```js
attach.on(myElement, 'click', myCallback);
attach.on(myElement, 'click', '.list-item', myCallback);
```

### attach.off(element, [eventType, selector])

Unbinds callback(s) from a given event pattern.

Internally we keep track of callback functions, so you don't have to have a reference to them at the point of unbinding, as you do when using `removeEventListener`.

```js
// Unbind click handler for a selector
attach.off(myElement, 'click', '.list-item');

// ...or unbind all 'click' handlers
attach.off(myElement, 'click');

//...or unbind all handlers
attach.off(myElement);
```

### attach(element, config, [, context])

Attach also provides a convenient shorthand (Backbone style) when binding several events at once.

```js
attach(myElement, {
  'click .foo': onFooClick,
  'click .bar': onBarClick
});

// ...later unbind them all

attach.off(myElement);
```

## Tests

#### With PhantomJS

```
$ npm install
$ npm test
```

#### Without PhantomJS

Open `test/index.html` in your browser.

## Author

- **Wilson Page** - [@wilsonpage](http://github.com/wilsonpage)

## License

[The MIT License](http://github.com/wilsonpage/attach/raw/LICENSE)