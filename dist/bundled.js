window["internetips"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (typeof Object.assign != 'function') {
  /*eslint-disable no-unused-vars */
  Object.assign = function (target, varArgs) {
    // .length of function is 2
    'use strict';

    if (target == null) {
      // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) {
        // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(0);

module.exports = {
  show: show,
  hide: hide,
  setConfig: setConfig,
  destroy: destroy,
  _restoreConfigDefaults: _restoreConfigDefaults,
  _inspectConfig: _inspectConfig,
  _defineTestHooks: _defineTestHooks
};

var containerNode, tipNode, isOpen, isFloating, pointX, pointY, frameNeedsUpdate, lastPlacementDirection, animationFrame, windowWidth, windowHeight,
/**
 * Whenever a tooltip is .show()n, activeParams are the settings for the
 * currently-being-rendered tooltip.
 */
activeParams;

// configuration
var configs = {
  containerClass: 'internetips-container',
  tooltipClass: 'internetips',
  activeClass: 'internetips-show',
  placeClass: {
    top: 'internetips-place-top',
    right: 'internetips-place-right',
    bottom: 'internetips-place-bottom',
    left: 'internetips-place-left'
  },
  typeClass: {
    dark: 'internetips-type-dark',
    light: 'internetips-type-light'
  },
  /**
   * The only way to set these defaults is via setConfig, but we disallow
   * setting the 'effect' default, because the only other option is "solid",
   * which would require a 'target' default (and target default defeats the
   * entire point of tooltips).
   */
  defaults: {
    /** "float" | "solid" - cannot be configured with a default */
    effect: 'float',
    /** domElement - cannot be configured with a default */
    target: null,
    /** null (dynamic) | 'top' | 'right' | 'bottom' | 'left' */
    place: null,
    /** 'dark' | 'light' - these are legacy options we have to support */
    type: 'dark',
    /** array of any default class names to add to always the tooltip node */
    classes: [],
    /** offset tooltip X axis */
    offsetX: 15,
    /** offset tooltip Y axis */
    offsetY: 15
  }
},


/**
 * Calculation helpers; accessible as properties.
 * @todo: memoize calls triggering layout recalculation to prevent thrashing.
 */
calcs = Object.create({}, {
  nodeWidth: {
    get: function get() {
      return tipNode.clientWidth;
    }
  },
  nodeHeight: {
    get: function get() {
      return tipNode.clientHeight;
    }
  },
  leftWhenVertical: {
    get: function get() {
      return pointX - this.nodeWidth / 2;
    }
  },
  topWhenHorizontal: {
    get: function get() {
      return pointY - this.nodeHeight / 2;
    }
  },
  rightWhenDirLeft: {
    get: function get() {
      return windowWidth - pointX + activeParams.offsetX;
    }
  },
  leftWhenDirRight: {
    get: function get() {
      return pointX + activeParams.offsetX;
    }
  },
  bottomWhenDirTop: {
    get: function get() {
      return windowHeight - (pointY - activeParams.offsetY);
    }
  },
  topWhenDirBottom: {
    get: function get() {
      return pointY + activeParams.offsetY;
    }
  },
  withinLeftWhenVert: {
    get: function get() {
      return this.leftWhenVertical > 0;
    }
  },
  withinRightWhenVert: {
    get: function get() {
      return pointX + this.nodeWidth / 2 < windowWidth;
    }
  },
  withinLeftAndRightWhenVert: {
    get: function get() {
      return this.withinRightWhenVert && this.withinLeftWhenVert;
    }
  },
  // "is there space when placed fully on top"
  canPlaceTop: {
    get: function get() {
      return pointY - (this.nodeHeight + activeParams.offsetY) > 0;
    }
  },
  // "is there space when placed fully on bottom"
  canPlaceBottom: {
    get: function get() {
      return pointY + this.nodeHeight + activeParams.offsetY < windowHeight;
    }
  },
  // "is there space left && when vertically centered its in viewport"
  canPlaceLeft: {
    get: function get() {
      return pointX - (this.nodeWidth + activeParams.offsetX) > 0 && this.topWhenHorizontal > 0;
    }
  },
  // "is there space right && when vertically centered its in viewport"
  canPlaceRight: {
    get: function get() {
      return pointX + this.nodeWidth + activeParams.offsetX < windowWidth && this.topWhenHorizontal > 0;
    }
  }
});

/**
 * Try as much as possible to use a requestAnimationFrame implementation,
 * but if unavailable, we don't provide a polyfill and instead just log
 * to the console. In other words, conciously do not support browsers
 * that don't have this. HOWEVER - the tooltip will still show up positioned
 * with 'solid' mode, it just won't follow the mouse.
 */
var _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function () {
  console.warn('tooltips require requestAnimationFrame; `float` will not work.');
};

var _cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame || function () {};

// Null by default, these hooks can be set via injected callables that will
// be invoked during relevant API calls. These should be used explicity for
// testing purposes.
var onShowHook, onHideHook, onDestroyHook;

/**
 * Set configuration defaults. If the tooltip node already exists (eg. has been
 * .show()n once), disallow changing configs. Also, since the properties
 * defaults.target and defaults.effect are per-instance specific, we do some
 * funny stuff to disallow setting these defaults.
 *
 * Note - the use of Object.assign() here is pretty rigid and will require
 * changes if the default configs change, but explicity handling depth merges
 * vs. doing deep merges keeps things predictable.
 */
function setConfig() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (tipNode) {
    return console.warn('Disallowed: set tooltip configs after first .show().');
  }
  Object.assign(configs, options, { placeClass: Object.assign({}, configs.placeClass, options.placeClass) }, { typeClass: Object.assign({}, configs.typeClass, options.typeClass) }, { defaults: Object.assign({}, configs.defaults, options.defaults, {
      // ensure 'effect' and 'target' defaults are retained
      effect: configs.defaults.effect,
      target: configs.defaults.target
    }) });
}

/**
 * Show a tooltip. Notes:
 * a) If no tooltip had been .show()n previously, this will intiialize
 *    everything, including event listeners on the window
 * b) We have to call setTooltipClasses() here so that the tooltip node
 *    receives any additional classes which may influence its sizing
 *    calculations. Invoking setTooltipClasses() without an argument
 *    will make any classes passed via options be appended.
 */
function show(options) {
  if (!options || !options.content) {
    return console.warn('Cannot .show() tooltip without `content` param.');
  }
  ensureInitializedAndReady();
  // Merge options against the config defaults, and do some funky stuff
  // to ensure that the array values of the 'classes' property get concatenated
  // instead of overridden by Object.assign(). Again, the explicitness here
  // is preferable to using a deep merge fn of some sort.
  activeParams = Object.assign({}, configs.defaults, options, {
    classes: configs.defaults.classes.concat(options.classes || [])
  });
  // Is content a DOM node, or a string we want to append as innerHTML?
  if (activeParams.content instanceof Element) {
    tipNode.appendChild(activeParams.content);
  } else {
    tipNode.innerHTML = activeParams.content;
  }
  setTooltipClasses();
  if (activeParams.effect === 'solid') {
    return renderSolid();
  }
  renderFloating();
}

/**
 * Hide tooltip. Cleans up settings on the currently shown tooltip, and hides.
 */
function reset() {
  activeParams = pointX = pointY = lastPlacementDirection = null;
  isOpen = isFloating = false;
  frameNeedsUpdate = true;
  _cancelAnimationFrame(animationFrame);
  document.removeEventListener('mousemove', trackMousePosition);
  if (tipNode) {
    tipNode.style.cssText = null;
    tipNode.className = configs.tooltipClass;
    while (tipNode.firstChild) {
      tipNode.removeChild(tipNode.firstChild);
    }
    tipNode.innerHTML = '';
  }
}

/**
 * This is the *publicly* exposed hide function (instead of proxying the reset
 * function directly as 'hide', because we want to enable the onHideHook and
 * invoke it only when the public fn is invoked).
 */
function hide() {
  reset();

  // Test hook integration
  if (typeof onHideHook === 'function') {
    onHideHook();
  }
}

/**
 * Unbind err'thang and clean up DOM nodes.
 */
function destroy() {
  unbindWindowEvents();
  reset();
  tipNode && tipNode.parentNode.removeChild(tipNode);
  containerNode && containerNode.parentNode.removeChild(containerNode);
  containerNode = tipNode = null;

  // Test hook integration
  if (typeof onDestroyHook === 'function') {
    onDestroyHook();
  }
}

/**
 * Render a tooltip with effect "solid"; we treat it different by calculating
 * the offsets{X,Y} with half the width and height, respectively, of the
 * target node. This makes the tooltip position against an edge, as opposed
 * to in the middle (think of a 500x500 px square, we don't want the tooltip
 * to show up with an arrow in the middle of that - it should sit outside).
 * Notice the difference with renderFloating() method; where isFloating gets
 * set to true. Having it set to false means we won't kick off an
 * animationFrame loop, it just calculates the tooltip stuff and renders once.
 */
function renderSolid() {
  if (!activeParams.target) {
    reset();
    return console.warn('Cannot .show() tooltip when effect === `solid` without target node.');
  }
  var targetBB = activeParams.target.getBoundingClientRect();
  activeParams.offsetX += parseInt(targetBB.width / 2) || 0;
  activeParams.offsetY += parseInt(targetBB.height / 2) || 0;
  pointX = targetBB.left + targetBB.width / 2;
  pointY = targetBB.top + targetBB.height / 2;
  updateTooltip();
}

/**
 * Setup the mousemove event listener and ensure isFloating is true so we
 * enter the animationFrame loop. Although a DOM target is not required when
 * tooltip is in floating mode, if one was passed, set the initial pointX and
 * pointY values to the center of that node before we kick off the loop so
 * that on the first pass, it has something close to work with, as opposed to
 * using just 0 or null values.
 */
function renderFloating() {
  if (activeParams.target) {
    var targetBB = activeParams.target.getBoundingClientRect();
    pointX = targetBB.left + targetBB.width / 2;
    pointY = targetBB.top + targetBB.height / 2;
  }
  isFloating = true;
  document.addEventListener('mousemove', trackMousePosition);
  updateTooltip();
}

/**
 * The meat of calculating where the tooltip should be placed.
 */
/* eslint complexity: [2, 9] */
function updateTooltip() {
  if (frameNeedsUpdate) {
    var styles = {};

    // If either a "place" position wasn't specified, or that place couldn't
    // be used, handle it like dynamically.
    if (!tryWithSpecifiedPlacement(styles)) {
      var direction;
      switch (true) {
        case !calcs.withinLeftWhenVert:
          styles.top = calcs.topWhenHorizontal;
          styles.left = calcs.leftWhenDirRight;
          direction = 'right';
          break;

        case !calcs.withinRightWhenVert:
          styles.top = calcs.topWhenHorizontal;
          styles.right = calcs.rightWhenDirLeft;
          direction = 'left';
          break;

        case !calcs.canPlaceTop:
          styles.left = calcs.leftWhenVertical;
          styles.top = calcs.topWhenDirBottom;
          direction = 'bottom';
          break;

        default:
          styles.left = calcs.leftWhenVertical;
          styles.bottom = calcs.bottomWhenDirTop;
          direction = 'top';
      }
      setTooltipClasses(configs.placeClass[direction]);
    }
    setStyle(styles);
    frameNeedsUpdate = false;
    isOpen = true;

    // Test hook integration
    if (typeof onShowHook === 'function') {
      onShowHook(containerNode.innerHTML);
    }
  }

  if (isFloating) {
    animationFrame = _requestAnimationFrame(updateTooltip);
  }
}

/**
 * Break up the updateTooltip method so its not one masssive function
 * to reduce complexity errors (although still too complex). Accepts
 * a styles object *by reference*, and returns true or false depending
 * on whether solid positioning worked, or whether it should continue on
 * to trying to position dynamically.
 */
/* eslint complexity: [2, 10] */
function tryWithSpecifiedPlacement(styles) {
  var solidPositioningWorkedSkipDynamic = false;

  if (!activeParams.place) {
    return solidPositioningWorkedSkipDynamic;
  }

  switch (activeParams.place) {
    case 'top':
      if (calcs.canPlaceTop && calcs.withinLeftAndRightWhenVert) {
        setTooltipClasses(configs.placeClass.top);
        styles.bottom = calcs.bottomWhenDirTop;
        styles.left = calcs.leftWhenVertical;
        solidPositioningWorkedSkipDynamic = true;
      }
      break;

    case 'right':
      if (calcs.canPlaceRight) {
        setTooltipClasses(configs.placeClass.right);
        styles.top = calcs.topWhenHorizontal;
        styles.left = calcs.leftWhenDirRight;
        solidPositioningWorkedSkipDynamic = true;
      }
      break;

    case 'bottom':
      if (calcs.canPlaceBottom && calcs.withinLeftAndRightWhenVert) {
        setTooltipClasses(configs.placeClass.bottom);
        styles.top = calcs.topWhenDirBottom;
        styles.left = calcs.leftWhenVertical;
        solidPositioningWorkedSkipDynamic = true;
      }
      break;

    case 'left':
      if (calcs.canPlaceLeft) {
        setTooltipClasses(configs.placeClass.left);
        styles.top = calcs.topWhenHorizontal;
        styles.right = calcs.rightWhenDirLeft;
        solidPositioningWorkedSkipDynamic = true;
      }
      break;
  }

  return solidPositioningWorkedSkipDynamic;
}

/**
 * Take an object with style declarations, stringify, and set
 * cssText on tooltip node.
 */
function setStyle(styles) {
  var styleString = '';
  for (var prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      styleString += prop + ':' + parseInt(styles[prop]) + 'px;';
    }
  }
  tipNode.style.cssText = styleString;
}

/**
 * Set classes on the tooltip *if* work is required. We memoize the
 * last "direction" class name, and if its the same, we don't have to
 * set the class values again, saving work for the browser.
 */
function setTooltipClasses(directionClass) {
  if (lastPlacementDirection === directionClass) {
    return;
  }
  lastPlacementDirection = directionClass;
  tipNode.className = [configs.tooltipClass, configs.activeClass, configs.typeClass[activeParams.type], directionClass].concat(activeParams.classes).join(' ');
}

/**
 * Create tooltip nodes on the DOM. This works in a way such that if
 * implementors want to put the .internetips-container <div> in a custom spot,
 * as long as its created on the page before the first tooltip is initialized,
 * it'll just use the existing node.
 */
function ensureInitializedAndReady() {
  if (tipNode) {
    return reset();
  }

  containerNode = document.querySelector('.' + configs.containerClass);
  if (!containerNode) {
    containerNode = document.createElement('div');
    containerNode.className = configs.containerClass;
    document.body.appendChild(containerNode);
  }

  tipNode = containerNode.querySelector('.' + configs.tooltipClass);
  if (!tipNode) {
    tipNode = document.createElement('div');
    tipNode.className = configs.tooltipClass;
    containerNode.appendChild(tipNode);
  }

  /** Cache window dimensions */
  windowWidth = document.body.getBoundingClientRect().width;
  windowHeight = window.innerHeight;
  bindWindowEvents();
  reset();
}

/**
 * These events last for the duration of the window after the first
 * .show() is called (eg. *not* removed when hide is called), but
 * *are* unbound when .destroy() is called. Its less expensive to leave
 * the event listeners initialized, since they do little work, then
 * binding and unbinding between every show()/reset() call.
 * Note: this should only be called once, during the first initialization,
 * but just to ensure we don't accidentally bind multiple listeners of the
 * same type, we unbindWindowEvents() as a precaution before ever binding
 * again.
 */
function bindWindowEvents() {
  unbindWindowEvents();
  window.addEventListener('scroll', trackWindowScroll);
  window.addEventListener('resize', trackWindowResize);
}

/**
 * Unbind window event listeners.
 */
function unbindWindowEvents() {
  window.removeEventListener('scroll', trackWindowScroll);
  window.removeEventListener('resize', trackWindowResize);
}

/**
 * 'onscroll' handler; if a scroll event occurs, we want to hide the
 * tooltip (this is mainly to prevent the tooltip from sticking on touch
 * devices when it should disappear). To make this call cheap and not do
 * work on *every* scroll occurrence, we only hide if the tooltip is
 * currently open.
 */
function trackWindowScroll() {
  if (isOpen === true) {
    reset();
  }
}

/**
 * 'onresize' handler; used to udpate cached window dimensions.
 */
function trackWindowResize() {
  windowWidth = document.body.getBoundingClientRect().width;
  windowHeight = window.innerHeight;
}

/**
 * 'mousemove' handler; only relevant when tooltip is in 'float' mode.
 */
function trackMousePosition(ev) {
  frameNeedsUpdate = true;
  pointX = ev.clientX;
  pointY = ev.clientY;
}

/**
 * Testing purposes only; give a way to introspect. These methods *are* made
 * public, but if implementors decide to use them its on them.
 */
var stashedConfigs = JSON.parse(JSON.stringify(configs));

function _restoreConfigDefaults() {
  Object.assign(configs, stashedConfigs);
}

function _inspectConfig() {
  return configs;
}

function _defineTestHooks() {
  var definitions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  onShowHook = definitions.onShow || null;
  onHideHook = definitions.onHide || null;
  onDestroyHook = definitions.onDestroy || null;
}

/***/ })
/******/ ]);