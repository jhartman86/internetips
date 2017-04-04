import * as tooltips from '../../lib';
import { expect } from 'chai';
const _ = require('lodash');
const sinon = require('sinon');
const tooltipTestUtils = require('../helpers');
const mouseMove = tooltipTestUtils.mouseMove;


context('create, hide, destroy', function () {

  this.timeout(10000);

  var viewport = Object.create({}, {
    width: {get: function () {
      return window.innerWidth;
    }},
    height: {get: function () {
      return window.innerHeight;
    }},
    midX: {get: function () {
      return this.width / 2;
    }},
    midY: {get: function () {
      return this.height / 2;
    }}
  });

  before(tooltips.destroy);
  before(tooltips._restoreConfigDefaults);

  context('warning messages', () => {
    var spy;

    before(() => {
      spy = sinon.spy(console, 'warn');
    });

    after(() => {
      console.warn.restore();
      tooltips.destroy();
    });

    it('should warn if trying to .show() tooltip with no params', () => {
      tooltips.show();
      expect(spy.args[0][0]).to.contain(
        'without `content` param'
      );
    });

    it('should warn if trying to .setConfig()s after init', () => {
      tooltips.show({content:'<p>yolo</p>'});
      tooltips.setConfig({});
      expect(spy.args[1][0]).to.contain(
        'Disallowed: set tooltip configs'
      );
    });
  });

  context('basic instantiation', () => {

    before(tooltips.destroy);
    before(tooltips._restoreConfigDefaults);

    it('should show (and create DOM nodes), hide and destroy', function () {
      var content = '<p>test-ing</p>';
      // no tooltip nodes should be present yet...
      expect(
        document.querySelector('.internetips-container')
      ).to.be.null;

      tooltips.show({content});
      // it should have automatically created the tooltip nodes...
      var container = document.querySelector('.internetips-container'),
        tooltip = container.querySelector('.internetips');
      expect(container).to.be.ok;
      expect(tooltip).to.be.ok;
      // it should add the 'active' (visible) class to the tooltip
      expect(tooltip).to.equal(container.querySelector('.internetips-show'));
      expect(tooltip.innerHTML).to.contain(content);

      tooltips.hide();
      // it should KEEP the dom nodes around, but remove the visible class
      expect(container).to.be.ok;
      expect(tooltip).to.be.ok;
      expect(container.querySelector('.internetips-show')).to.not.be.ok;

      tooltips.destroy();
      // it should remove the nodes entirely when destroy is called
      expect(document.querySelector('.internetips-container')).to.not.be.ok;
      expect(document.querySelector('.internetips')).to.not.be.ok;
      container = tooltip = null;
    });
  });

  context('monitor style mutations by mouse movement triggers', () => {

    after(tooltips.destroy);

    /**
     * This test has a lot going on, but here's why: In short, we setup a
     * mutation observer on the tooltip node so we can watch for any changes
     * made to it on the DOM (style updates). When a mutation event fires,
     * it *should* always be different than a previous one (in this test at
     * least); so a mutation should never occur receiving the same information
     * as the previous one. This tests the caching mechanism in the tooltip
     * library: since animationFrame runs in a fast loop, we don't want it to
     * always be tryna' run node.style.cssText = '...' if the style value
     * would be the same as the previous tick. Hence why in the loop at the
     * bottom, we have 3 mouseMove calls in a row, triggering events
     * with the same position. If the caching mechanism doesn't work, the
     * mutationObserver will receive and collect those duplicates, and this'll
     * fail.
     *
     * All ^ that said - this implicitly tests what is described: that
     * position updates are occurring on the DOM, without duplicates.
     *
     * It should update position when mouse moves and not trigger style
     * updates if the position has not changed.
     */
    it('should only trigger DOM mutations as necessary', (done) => {
      // microsoft still kinda sucks and Edge doesn't trigger mutation
      // observer handlers when style.cssText is mutated, so we're skipping
      // it for now :(
      if (_.get(navigator, 'userAgent', '').indexOf('Edge')) {
        return done();
      }

      tooltips.show({content:'<p>test</p>'});
      var styleLeftMutations = [];
      var observer = new MutationObserver(function (mutations) {
        var bb = mutations[0].target.getBoundingClientRect();
        expect(styleLeftMutations).to.not.include(bb.left);
        styleLeftMutations.push(bb.left);
      });
      observer.observe(document.querySelector('.internetips'), {
        attributes: true
      });
      var startFrom = viewport.width / 2;
      (function _move(x) {
        if (x >= startFrom + 30) {
          observer.disconnect();
          expect(styleLeftMutations.length).to.equal(3);
          return done();
        }
        // The point of calling mouseMove 3x consecutively is to see if the mutation 
        // observer handler gets invoked consecutively, in which case we're issuing
        // changes to the DOM too frequently
        mouseMove(x, viewport.height / 2);
        mouseMove(x, viewport.height / 2);
        mouseMove(x, viewport.height / 2);
        // Give the delay an inordinate amount of time before the next event
        // fires, to ensure that animationFrame doesn't skip any (even though
        // thats what we want when the mouse is moving quickly).
        _.delay(function () {_move(x + 10);}, 550);
      })(startFrom);
    });
  });

  context('basic usage and configs', function () {

    before(tooltips.destroy);

    afterEach(function () {
      tooltips.destroy();
      tooltips._restoreConfigDefaults();
    });

    it('should use predefined container, if already on page', function () {
      var fragment = document.createDocumentFragment(),
        div = document.createElement('div');
      div.className = 'test-container-target';
      div.innerHTML = '<div class="internetips-container"></div>';
      fragment.appendChild(div);
      document.body.appendChild(fragment);

      tooltips.show({content:'<p>controlled insertion</p>'});
      expect(div.querySelector('.internetips')).to.be.ok;
      div.parentNode.removeChild(div);
    });

    it('should decorate the tooltip with custom classes', function () {
      tooltips.show({
        content: '<p>lorem ipsum</p>',
        classes: ['uno', 'dos']
      });
      var tooltipClassList = document.querySelector('.internetips').classList;
      expect(tooltipClassList.contains('internetips-show')).to.equal(true);
      expect(tooltipClassList.contains('uno')).to.equal(true);
      expect(tooltipClassList.contains('dos')).to.equal(true);
    });

    it('should update the tooltip when sequential .show()s called, without ' +
    '.hide() called in between', function () {
      tooltips.show({
        content: '<span>first</span>',
        classes: ['lorem']
      });
      var tooltip = document.querySelector('.internetips');
      expect(tooltip.innerHTML).to.contain('<span>first</span>');
      expect(tooltip.classList.contains('internetips-show')).to.equal(true);
      expect(tooltip.classList.contains('lorem')).to.equal(true);

      tooltips.show({
        content: '<h1>second</h1>',
        classes: ['ipsum']
      });

      expect(tooltip.innerHTML).to.contain('<h1>second</h1>');
      expect(tooltip.classList.contains('internetips-show')).to.equal(true);
      expect(tooltip.classList.contains('ipsum')).to.equal(true);
    });

    it('should configure container/tooltip/active classes', function () {
      tooltips.setConfig({
        containerClass: 'alpha',
        tooltipClass: 'bravo',
        activeClass: 'charlie'
      });
      tooltips.show({content:'<p>wowza</p>'});
      expect(document.querySelector('.alpha')).to.be.ok;
      expect(document.querySelector('.bravo')).to.be.ok;
      expect(document.querySelector('.charlie')).to.be.ok;
    });

    // These are unit-ish type tests, as we're just validating that
    // the options get set, NOT that the tooltip logic is using
    // them correctly. Chicken and egg type problem, so just being thorough.
    // All of these are candidates for being removed in the future if need be.
    context('unit-type config tests', function () {

      before(tooltips._restoreConfigDefaults);
      afterEach(tooltips._restoreConfigDefaults);

      it('should configure directional place classes', function () {
        tooltips.setConfig({
          placeClass: {
            top: 'test-top',
            right: 'test-right',
            bottom: 'test-bottom',
            left: 'test-left'
          }
        });

        var configured = tooltips._inspectConfig();
        expect(configured.placeClass.top).to.equal('test-top');
        expect(configured.placeClass.right).to.equal('test-right');
        expect(configured.placeClass.bottom).to.equal('test-bottom');
        expect(configured.placeClass.left).to.equal('test-left');
      });

      it('should configure type classes', function () {
        tooltips.setConfig({
          typeClass: {
            dark: 'test-dark',
            light: 'test-light'
          }
        });

        var configured = tooltips._inspectConfig();
        expect(configured.typeClass.dark).to.equal('test-dark');
        expect(configured.typeClass.light).to.equal('test-light');
      });

      it('configures defaults disallowing set target or effect properties',
        function () {
          tooltips.setConfig({
            defaults: {
              effect: 'anythang',
              target: 'anythang2',
              place: 'right',
              type: 'light',
              classes: ['custom-klass'],
              offsetX: 30,
              offsetY: 30
            }
          });

          var configured = tooltips._inspectConfig();
          // should still be original defaults
          expect(configured.defaults.effect).to.equal('float');
          expect(configured.defaults.target).to.equal(null);

          // should have changed
          expect(configured.defaults.place).to.equal('right');
          expect(configured.defaults.type).to.equal('light');
          expect(configured.defaults.classes.length).to.equal(1);
          expect(configured.defaults.classes[0]).to.equal('custom-klass');
          expect(configured.defaults.offsetX).to.equal(30);
          expect(configured.defaults.offsetY).to.equal(30);
        }
      );
    });
  });

});
