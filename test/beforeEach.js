var fixtures = document.getElementById('fixtures');

beforeEach(function() {
  fixtures.innerHTML = '<div class="parent">' +
    '<div class="child"></div>' +
    '<div class="foo"></div>' +
    '<div class="bar">' +
      '<div class="baz"></div>' +
    '</div>' +
  '</div>';
});