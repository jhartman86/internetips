'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.destroy = exports.setConfig = exports.hide = exports.show = undefined;

var _shims = require('./shims');

exports.show = show;
exports.hide = hide;
exports.setConfig = setConfig;
exports.destroy = destroy;


var containerNode, tipNode, isOpen, isFloating, pointX, pointY, frameNeedsUpdate, lastPlacementDirection, animationFrame, windowWidth, windowHeight,
/**
 * Whenever a tooltip is .show()n, activeParams are the settings for the
 * currently-being-rendered tooltip.
 */
activeParams;

// configuration
var configs = {
  containerClass: 'fc-tooltip-container',
  tooltipClass: 'fc-tooltip',
  activeClass: 'fc-tooltip-show',
  placeClass: {
    top: 'fc-tooltip-place-top',
    right: 'fc-tooltip-place-right',
    bottom: 'fc-tooltip-place-bottom',
    left: 'fc-tooltip-place-left'
  },
  typeClass: {
    dark: 'fc-tooltip-type-dark',
    light: 'fc-tooltip-type-light'
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
  Object.assign(configs, { placeClass: Object.assign({}, configs.placeClass, options.placeClass) }, { typeClass: Object.assign({}, configs.typeClass, options.typeClass) }, { defaults: Object.assign({}, configs.defaults, options.defaults, {
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
  tipNode.innerHTML = activeParams.content;
  setTooltipClasses();
  if (activeParams.effect === 'solid') {
    return renderSolid();
  }
  renderFloating();
}

/**
 * Hide tooltip. Cleans up settings on the currently shown tooltip, and hides.
 */
function hide() {
  activeParams = pointX = pointY = lastPlacementDirection = null;
  isOpen = isFloating = false;
  frameNeedsUpdate = true;
  (0, _shims._cancelAnimationFrame)(animationFrame);
  document.removeEventListener('mousemove', trackMousePosition);
  if (tipNode) {
    tipNode.style.cssText = null;
    tipNode.className = configs.tooltipClass;
    tipNode.innerHTML = null;
  }
}

/**
 * Unbind err'thang and clean up DOM nodes.
 */
function destroy() {
  unbindWindowEvents();
  hide();
  tipNode && tipNode.parentNode.removeChild(tipNode);
  containerNode && containerNode.parentNode.removeChild(containerNode);
  containerNode = tipNode = null;
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
    hide();
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
  }

  if (isFloating) {
    animationFrame = (0, _shims._requestAnimationFrame)(updateTooltip);
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
 * implementors want to put the .fc-tooltip-container <div> in a custom spot,
 * as long as its created on the page before the first tooltip is initialized,
 * it'll just use the existing node.
 */
function ensureInitializedAndReady() {
  if (tipNode) {
    return hide();
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
  hide();
}

/**
 * These events last for the duration of the window after the first
 * .show() is called (eg. *not* removed when hide is called), but
 * *are* unbound when .destroy() is called. Its less expensive to leave
 * the event listeners initialized, since they do little work, then
 * binding and unbinding between every show()/hide() call.
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
    hide();
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