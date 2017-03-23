var _ = require('lodash');

module.exports.afterNextFrame = ensureTimeToRender;

module.exports.mouseMove = function (x, y) {
  var event;
  try {
    event = new MouseEvent('mousemove', {
      clientX: x,
      clientY: y
    });
  } catch (e) {
    // IE is the freaking worst...
    event = document.createEvent('MouseEvent');
    event.initMouseEvent('mousemove',
      true, true, window, 0, 0, 0,
      x, y,
      false, false, false, false, 0, null
    );
  }
  document.dispatchEvent(event);
};

function ensureTimeToRender(callback) {
  requestAnimationFrame(function () {
    _.defer(callback);
  });
}
