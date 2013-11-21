
suite('bind', function() {

  test('Should fire the callback', function() {
    var callback = sinon.spy();
    var el = $('.parent');
    var child = $('.child');

    attach.on(el, 'click', '.child', callback);
    simulate('click', child);

    assert(callback.called);
  });

  test('Should not fire the callback after it has been removed', function() {
    var callback = sinon.spy();
    var el = $('.parent');
    var child = $('.child');

    attach.on(el, 'click', '.child', callback);
    attach.off(el, 'click', '.child');

    simulate('click', child);
    assert(!callback.called);
  });

  test('Should remove all callbacks if just event type given', function() {
    var callback = sinon.spy();
    var parent = $('.parent');
    var child1 = $('.foo');
    var child2 = $('.bar');

    attach.on(parent, 'click', '.foo', callback);
    attach.on(parent, 'click', '.bar', callback);

    attach.off(parent, 'click');

    simulate('click', child1);
    simulate('click', child2);

    assert(!callback.called, 'Should not have called any callbacks');
  });

  test('Should remove just the selector callback specified', function() {
    var parent = $('.parent');
    var child1 = $('.foo');
    var child2 = $('.bar');
    var callback1 = sinon.spy();
    var callback2 = sinon.spy();

    attach.on(parent, 'click', '.foo', callback1);
    attach.on(parent, 'click', '.bar', callback2);

    attach.off(parent, 'click', '.foo');

    simulate('click', child1);
    simulate('click', child2);

    assert(!callback1.called, 'Should not call have called the .foo callback');
    assert(callback2.called, 'Should have still called the .bar callback');
  });

  test('Should remove listeners of *all* types if no type is given', function() {
    var onClick = sinon.spy();
    var onMouseover = sinon.spy();
    var parent = $('.parent');
    var foo = $('.foo');

    attach.on(parent, 'mousedown', '.foo', onMouseover);
    attach.on(parent, 'click', '.foo', onClick);

    attach.off(parent);

    simulate('click', foo);
    simulate('mousedown', foo);

    assert(!onClick.called, 'Should not have called the \'click\' callback');
    assert(!onMouseover.called, 'Should not have called the \'mouseover\' callback');
  });

  test('Should call the callback on the given context', function() {
    var parent = $('.parent');
    var child1 = $('.foo');
    var callback1 = sinon.spy();
    var ctx = { custom: 'context' };

    attach.on(parent, 'click', '.foo', callback1, ctx);

    simulate('click', child1);

    assert(callback1.firstCall.calledOn(ctx));
  });

  test('Should be able to bind event handlers to the root if selector not given', function() {
    var parent = $('.parent');
    var foo = $('.foo');
    var callback = sinon.spy();

    attach.on(parent, 'click', callback);
    simulate('click', parent);

    assert(callback.called, 'The callback should have been called');
  });

  test('Should stopPropagation if false is returned from callback', function() {
    var parent = $('.parent');
    var baz = $('.baz');
    var callback2 = sinon.spy();
    var callback1 = sinon.spy(function() { return false; });

    attach.on(parent, 'click', callback2);
    attach.on(parent, 'click', '.bar', callback2);
    attach.on(parent, 'click', '.baz', callback1);

    simulate('click', baz);

    assert(callback1.called, 'The first callback should have been called');
    assert(!callback2.called, 'Callbacks further up the DOM should not have been called');
  });

  test('Should be able to attach events using backbone style shorthand', function() {
    var callback = sinon.spy();
    var parent = $('.parent');
    var baz = $('.baz');

    attach(parent, {
      'click': callback,
      'click .baz': callback
    });

    simulate('click', baz);

    assert(callback.calledTwice, 'Should have called the callback twice');
  });
});