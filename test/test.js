
suite('bind', function() {

  test("Should fire the callback", function() {
    var callback = sinon.spy();
    var el = document.querySelector('.parent');
    var child = document.querySelector('.child');

    delegate(el, 'click', '.child', callback);
    simulate('click', child);

    assert(callback.called);
  });

  test("Should not fire the callback after it has been removed", function() {
    var callback = sinon.spy();
    var el = document.querySelector('.parent');
    var child = document.querySelector('.child');

    delegate(el, 'click', '.child', callback);
    delegate.off(el, 'click', '.child');

    simulate('click', child);
    assert(!callback.called);
  });

  test("Should remove all callbacks if just event type given", function() {
    var callback = sinon.spy();
    var parent = document.querySelector('.parent');
    var child1 = document.querySelector('.foo');
    var child2 = document.querySelector('.bar');

    delegate(parent, 'click', '.foo', callback);
    delegate(parent, 'click', '.bar', callback);
    delegate.off(parent, 'click');

    simulate('click', child1);
    simulate('click', child2);

    assert(!callback.called);
  });

  test("Should remove just the selector callback specified", function() {
    var parent = document.querySelector('.parent');
    var child1 = document.querySelector('.foo');
    var child2 = document.querySelector('.bar');
    var callback1 = sinon.spy();
    var callback2 = sinon.spy();

    delegate(parent, 'click', '.foo', callback1);
    delegate(parent, 'click', '.bar', callback2);

    delegate.off(parent, 'click', '.foo');

    simulate('click', child1);
    simulate('click', child2);

    assert(!callback1.called);
    assert(callback2.called);
  });

  test("Should call the callback on the given context", function() {
    var parent = document.querySelector('.parent');
    var child1 = document.querySelector('.foo');
    var callback1 = sinon.spy();
    var ctx = { custom: 'context' };

    delegate(parent, 'click', '.foo', callback1, ctx);

    simulate('click', child1);

    assert(callback1.firstCall.calledOn(ctx));
  });

});