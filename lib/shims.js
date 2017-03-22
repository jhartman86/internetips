/**
 * Try as much as possible to use a requestAnimationFrame implementation,
 * but if unavailable, we don't provide a polyfill and instead just log
 * to the console. In other words, conciously do not support browsers
 * that don't have this. HOWEVER - the tooltip will still show up positioned
 * with 'solid' mode, it just won't follow the mouse.
 */

const _requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function () {
    console.warn(
      'tooltips require requestAnimationFrame; `float` will not work.'
    );
  };

const _cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelRequestAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  window.msCancelAnimationFrame ||
  function () {};

export { _requestAnimationFrame, _cancelAnimationFrame };
