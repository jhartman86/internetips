import * as tooltips from '../../lib';
import { expect, assert } from 'chai';
const _ = require('lodash');
const tooltipTestUtils = require('../helpers');
const mouseMove = tooltipTestUtils.mouseMove;
const afterNextFrame = tooltipTestUtils.afterNextFrame;
const $qs = function (query) {
  return document.querySelector(query);
};

/*eslint max-statements: ['error', 50]*/
describe('tooltips tooltipLib', function () {

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

  context('placement rules', function () {
    before(function () {
      var styleSheet = makeDummyStyleSheet();
      styleSheet.insertRule('.internetips {width:180px;}', 0);
    });

    after(destroyDummyStyleSheet);

    context('effect:float', function () {

      context('with room all around', function () {
        afterEach(tooltips.destroy);

        floatShouldPlaceTopAuto(viewport.midX, viewport.midY);
        floatShouldPlaceTopSpecified(viewport.midX, viewport.midY);

        floatShouldNotPlaceRightAuto(viewport.midX, viewport.midY);
        floatShouldPlaceRightSpecified(viewport.midX, viewport.midY);

        floatShouldNotPlaceLeftAuto(viewport.midX, viewport.midY);
        floatShouldPlaceLeftSpecified(viewport.midX, viewport.midY);

        floatShouldNotPlaceBottomAuto(viewport.midX, viewport.midY);
        floatShouldPlaceBottomSpecified(viewport.midX, viewport.midY);
      });

      context('no room: right', function () {
        var x = viewport.width - 1;
        afterEach(tooltips.destroy);

        floatShouldNotPlaceTopAuto(x, viewport.midY);
        floatShouldNotPlaceTopSpecified(x, viewport.midY);

        floatShouldNotPlaceRightAuto(x, viewport.midY);
        floatShouldNotPlaceRightSpecified(x, viewport.midY);

        floatShouldPlaceLeftAuto(x, viewport.midY);
        floatShouldPlaceLeftSpecified(x, viewport.midY);

        floatShouldNotPlaceBottomAuto(x, viewport.midY);
        floatShouldNotPlaceBottomSpecified(x, viewport.midY);
      });

      context('no room: left', function () {
        var x = 1;
        afterEach(tooltips.destroy);

        floatShouldNotPlaceTopAuto(x, viewport.midY);
        // floatShouldPlaceTopSpecified(x, viewport.midY);

        floatShouldPlaceRightAuto(x, viewport.midY);
        floatShouldPlaceRightSpecified(x, viewport.midY);

        floatShouldNotPlaceLeftAuto(x, viewport.midY);
        floatShouldNotPlaceLeftSpecified(x, viewport.midY);

        floatShouldNotPlaceBottomAuto(x, viewport.midY);
        // floatShouldPlaceBottomSpecified(x, viewport.midY);
      });

      context('no room: bottom', function () {
        var y = viewport.height - 1;
        afterEach(tooltips.destroy);

        floatShouldPlaceTopAuto(viewport.midX, y);
        floatShouldPlaceTopSpecified(viewport.midX, y);

        floatShouldNotPlaceRightAuto(viewport.midX, y);
        floatShouldPlaceRightSpecified(viewport.midX, y);

        floatShouldNotPlaceLeftAuto(viewport.midX, y);
        floatShouldPlaceLeftSpecified(viewport.midX, y);

        floatShouldNotPlaceBottomAuto(viewport.midX, y);
        floatShouldNotPlaceBottomSpecified(viewport.midX, y);
      });

      context('no room: top', function () {
        var y = 1;
        afterEach(tooltips.destroy);

        floatShouldNotPlaceTopAuto(viewport.midX, y);
        floatShouldNotPlaceTopSpecified(viewport.midX, y);

        floatShouldNotPlaceRightAuto(viewport.midX, y);
        // floatShouldPlaceRightSpecified(viewport.midX, y);

        floatShouldNotPlaceLeftAuto(viewport.midX, y);
        // floatShouldPlaceLeftSpecified(viewport.midX, y);

        floatShouldPlaceBottomAuto(viewport.midX, y);
        floatShouldPlaceBottomSpecified(viewport.midX, y);
      });

    });


    context('effect:solid', function () {

      context('with room all around', function () {
        afterEach(tooltips.destroy);
        after(function () {
          targetBox.remove();
        });

        solidShouldPlaceTopAuto(viewport.midX, viewport.midY);
        solidShouldPlaceTopSpecified(viewport.midX, viewport.midY);

        solidShouldNotPlaceRightAuto(viewport.midX, viewport.midY);
        solidShouldPlaceRightSpecified(viewport.midX, viewport.midY);

        solidShouldNotPlaceLeftAuto(viewport.midX, viewport.midY);
        solidShouldPlaceLeftSpecified(viewport.midX, viewport.midY);

        solidShouldNotPlaceBottomAuto(viewport.midX, viewport.midY);
        solidShouldPlaceBottomSpecified(viewport.midX, viewport.midY);
      });

      context('no room: right', function () {
        var x = viewport.width - 51;
        afterEach(tooltips.destroy);
        after(function () {
          targetBox.remove();
        });

        solidShouldNotPlaceTopAuto(x, viewport.midY);
        // solidShouldPlaceTopSpecified(x, viewport.midY);

        solidShouldNotPlaceRightAuto(x, viewport.midY);
        solidShouldNotPlaceRightSpecified(x, viewport.midY);

        solidShouldPlaceLeftAuto(x, viewport.midY);
        solidShouldPlaceLeftSpecified(x, viewport.midY);

        solidShouldNotPlaceBottomAuto(x, viewport.midY);
        // solidShouldPlaceBottomSpecified(x, viewport.midY);
      });

      context('no room: left', function () {
        var x = 1;
        afterEach(tooltips.destroy);
        after(function () {
          targetBox.remove();
        });

        solidShouldNotPlaceTopAuto(x, viewport.midY);
        // solidShouldPlaceTopSpecified(x, viewport.midY);

        solidShouldPlaceRightAuto(x, viewport.midY);
        solidShouldPlaceRightSpecified(x, viewport.midY);

        solidShouldNotPlaceLeftAuto(x, viewport.midY);
        solidShouldNotPlaceLeftSpecified(x, viewport.midY);

        solidShouldNotPlaceBottomAuto(x, viewport.midY);
        // solidShouldPlaceBottomSpecified(x, viewport.midY);
      });

      context('no room: bottom', function () {
        var y = viewport.height - 51;
        afterEach(tooltips.destroy);
        after(function () {
          targetBox.remove();
        });

        solidShouldPlaceTopAuto(viewport.midX, y);
        solidShouldPlaceTopSpecified(viewport.midX, y);

        solidShouldNotPlaceLeftAuto(viewport.midX, y);
        solidShouldPlaceLeftSpecified(viewport.midX, y);

        solidShouldNotPlaceRightAuto(viewport.midX, y);
        solidShouldPlaceRightSpecified(viewport.midX, y);

        solidShouldNotPlaceBottomAuto(viewport.midX, y);
        solidShouldNotPlaceBottomSpecified(viewport.midX, y);
      });

      context('no room: top', function () {
        var y = 1;
        afterEach(tooltips.destroy);
        after(function () {
          targetBox.remove();
        });

        solidShouldNotPlaceTopAuto(viewport.midX, y);
        solidShouldNotPlaceTopSpecified(viewport.midX, y);

        solidShouldNotPlaceLeftAuto(viewport.midX, y);
        solidShouldPlaceLeftSpecified(viewport.midX, y);

        solidShouldNotPlaceRightAuto(viewport.midX, y);
        solidShouldPlaceRightSpecified(viewport.midX, y);

        solidShouldPlaceBottomAuto(viewport.midX, y);
        solidShouldPlaceBottomSpecified(viewport.midX, y);
      });

    });

    context('defaults:place:right', function () {
      before(tooltips._restoreConfigDefaults);
      before(function () {
        tooltips.setConfig({
          defaults: {
            place: 'right'
          }
        });
      });
      after(tooltips.destroy);

      floatShouldPlaceRightAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceTopAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceLeftAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceBottomAuto(viewport.midX, viewport.midY);

      floatShouldPlaceTopSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceRightSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceLeftSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceBottomSpecified(viewport.midX, viewport.midY);

      // 'when no room right, or top/bottom when centered'
      floatShouldNotPlaceRightAuto(viewport.width - 1, viewport.midY);
      floatShouldNotPlaceRightSpecified(viewport.width - 1, viewport.midY);
      floatShouldPlaceLeftAuto(viewport.width - 1, viewport.midY);

      // 'when no room right, but room top/bottom when centered'
      floatShouldPlaceTopAuto(viewport.width - 130, viewport.midY);
      floatShouldPlaceBottomAuto(viewport.width - 130, 10);
    });

    context('defaults:place:left', function () {
      before(tooltips._restoreConfigDefaults);
      before(function () {
        tooltips.setConfig({
          defaults: {
            place: 'left'
          }
        });
      });
      after(tooltips.destroy);

      floatShouldPlaceLeftAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceTopAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceRightAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceBottomAuto(viewport.midX, viewport.midY);

      floatShouldPlaceTopSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceLeftSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceRightSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceBottomSpecified(viewport.midX, viewport.midY);

      // 'when no room left, or top/bottom when centered'
      floatShouldNotPlaceLeftAuto(1, viewport.midY);
      floatShouldNotPlaceLeftSpecified(1, viewport.midY);
      floatShouldPlaceRightAuto(1, viewport.midY);

      // 'when no room left, but room top/bottom when centered'
      floatShouldPlaceTopAuto(130, viewport.midY);
      floatShouldPlaceBottomAuto(130, 10);
    });

    context('defaults:place:bottom', function () {
      before(tooltips._restoreConfigDefaults);
      before(function () {
        tooltips.setConfig({
          defaults: {
            place: 'bottom'
          }
        });
      });
      after(tooltips.destroy);

      floatShouldPlaceBottomAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceTopAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceLeftAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceRightAuto(viewport.midX, viewport.midY);

      floatShouldPlaceTopSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceBottomSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceRightSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceLeftSpecified(viewport.midX, viewport.midY);

      floatShouldNotPlaceBottomAuto(viewport.midX, viewport.height - 1);
      floatShouldNotPlaceBottomSpecified(viewport.midX, viewport.height - 1);
      floatShouldPlaceTopAuto(viewport.midX, viewport.height - 1);

      // 'if placed bottom, would overflow left, so moves right'
      floatShouldPlaceRightAuto(1, viewport.midY);
      // 'if placed bottom, would overflow right, so moves left'
      floatShouldPlaceLeftAuto(viewport.width - 1, viewport.midY);
    });

    context('defaults:place:top', function () {
      before(tooltips._restoreConfigDefaults);
      before(function () {
        tooltips.setConfig({
          defaults: {
            place: 'top'
          }
        });
      });
      after(tooltips.destroy);

      floatShouldPlaceTopAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceBottomAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceLeftAuto(viewport.midX, viewport.midY);
      floatShouldNotPlaceRightAuto(viewport.midX, viewport.midY);

      floatShouldPlaceTopSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceBottomSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceRightSpecified(viewport.midX, viewport.midY);
      floatShouldPlaceLeftSpecified(viewport.midX, viewport.midY);

      floatShouldNotPlaceTopAuto(viewport.midX, 1);
      floatShouldNotPlaceTopSpecified(viewport.midX, 1);
      floatShouldPlaceBottomAuto(viewport.midX, 1);

      // 'if placed top, would overflow left, so moves right'
      floatShouldPlaceRightAuto(1, viewport.midY);
      // 'if placed top, would overflow right, so moves left'
      floatShouldPlaceLeftAuto(viewport.width - 1, viewport.midY);
    });
  });

  /**
   * This is where we get into the more detailed minutea, checking that
   * the placement calculations of the tooltip were correct (which is
   * predicated on the all the positioning tests above working).
   */
  context('placement calculations', function () {

    function reset() {
      tooltips.destroy();
      tooltips._restoreConfigDefaults();
      /**
       * Because we have to honor the legacy styles from the old tooltip
       * library (which include using negative margin positioning based on the
       * placement direction - and that sucks), its easier to just override
       * the placement classes here to something that won't have any styles
       * incluencing it. This lets us test the offset calculations without
       * external influence.
       */
      tooltips.setConfig({
        placeClass: {
          top: 'this-has-no-styles',
          right: 'this-has-no-styles',
          bottom: 'this-has-no-styles',
          left: 'this-has-no-styles'
        }
      });
    }

    function cleanUp() {
      tooltips.destroy();
      targetBox.remove();
    }

    context('float:offsetY', function () {
      beforeEach(reset);
      after(cleanUp);

      /**
       * @todo: for some reason this is flaky when run on CI in Firefox;
       * running directly in browser via ?grep works ok.
       */
      it.skip('accounts offsetY with place:top', function (done) {
        tooltips.setConfig({defaults:{offsetY: 30}});
        simulateFloat({
          place: 'top',
          mouseX: viewport.midX,
          mouseY: viewport.midY
        }, function (tipNode, tipBoundingBox) {
          expect(tipBoundingBox.top).to.be.within(
            viewport.midY - (tipBoundingBox.height + 31),
            viewport.midY - (tipBoundingBox.height + 29)
          );
          done();
        });
      });

      it('accounts offsetY with place:bottom', function (done) {
        tooltips.setConfig({defaults:{offsetY: 30}});
        simulateFloat({
          place: 'bottom',
          mouseX: viewport.midX,
          mouseY: viewport.midY
        }, function (tipNode, tipBoundingBox) {
          expect(parseInt(tipBoundingBox.top)).to.be.within(
            parseInt(viewport.midY + 29),
            parseInt(viewport.midY + 31)
          );
          done();
        });
      });
    });

    context('float:offsetX', function () {
      beforeEach(reset);
      after(cleanUp);

      it('accounts offsetX with place:left', function (done) {
        tooltips.setConfig({defaults:{offsetX: 30}});
        simulateFloat({
          place: 'left',
          mouseX: viewport.midX,
          mouseY: viewport.midY
        }, function (tipNode, tipBoundingBox) {
          expect(tipBoundingBox.left).to.be.within(
            viewport.midX - (tipBoundingBox.width + 31),
            viewport.midX - (tipBoundingBox.width + 29)
          );
          done();
        });
      });

      it('accounts offsetX with place:right', function (done) {
        tooltips.setConfig({defaults:{offsetX: 30}});
        simulateFloat({
          place: 'right',
          mouseX: viewport.midX,
          mouseY: viewport.midY
        }, function (tipNode, tipBoundingBox) {
          expect(tipBoundingBox.left).to.be.within(
            viewport.midX + 29,
            viewport.midX + 31
          );
          done();
        });
      });
    });

    context('solid:offsetY', function () {
      beforeEach(reset);
      after(cleanUp);

      /**
       * @todo: for some reason this is flaky when run on CI in Firefox;
       * running directly in browser via ?grep works ok.
       */
      it.skip('positions top _edge_ of target: offsetY:0', function (done) {
        tooltips.setConfig({defaults:{offsetY:0}});
        simulateSolid({
          place: 'top',
          targetStyles: {
            top: viewport.midY,
            left: viewport.midX
          }
        }, function (tipNode, tipBoundingBox, targetBoundingBox) {
          expect(tipBoundingBox.top).to.be.within(
            targetBoundingBox.top - tipBoundingBox.height - 1,
            targetBoundingBox.top - tipBoundingBox.height + 1
          );
          done();
        });
      });

      /**
       * @todo: for some reason this is flaky when run on CI in Firefox;
       * running directly in browser via ?grep works ok.
       */
      it.skip('positions top _edge_ of target: offsetY:30', function (done) {
        tooltips.setConfig({defaults:{offsetY:30}});
        simulateSolid({
          place: 'top',
          targetStyles: {
            top: viewport.midY,
            left: viewport.midX
          }
        }, function (tipNode, tipBoundingBox, targetBoundingBox) {
          expect(tipBoundingBox.top).to.be.within(
            targetBoundingBox.top - tipBoundingBox.height - 31,
            targetBoundingBox.top - tipBoundingBox.height - 29
          );
          done();
        });
      });

      it('positions bottom _edge_ of target when offsetY:0', function (done) {
        tooltips.setConfig({defaults:{offsetY:0}});
        simulateSolid({
          place: 'bottom',
          targetStyles: {
            top: viewport.midY,
            left: viewport.midX
          }
        }, function (tipNode, tipBoundingBox, targetBoundingBox) {
          expect(tipBoundingBox.top).to.be.within(
            targetBoundingBox.top + targetBoundingBox.height - 1,
            targetBoundingBox.top + targetBoundingBox.height + 1
          );
          done();
        });
      });

      it('positions bottom _edge_ of target when offsetY:30', function (done) {
        tooltips.setConfig({defaults:{offsetY:30}});
        simulateSolid({
          place: 'bottom',
          targetStyles: {
            top: viewport.midY,
            left: viewport.midX
          }
        }, function (tipNode, tipBoundingBox, targetBoundingBox) {
          expect(tipBoundingBox.top).to.be.within(
            targetBoundingBox.top + targetBoundingBox.height + 29,
            targetBoundingBox.top + targetBoundingBox.height + 31
          );
          done();
        });
      });
    });

    context('solid:offsetX', function () {
      beforeEach(reset);
      after(cleanUp);

      it('positions right _edge_ of target when offsetX:0', function (done) {
        tooltips.setConfig({defaults:{offsetX:0}});
        simulateSolid({
          place: 'right',
          targetStyles: {
            top: viewport.midY,
            left: viewport.midX
          }
        }, function (tipNode, tipBoundingBox, targetBoundingBox) {
          expect(tipBoundingBox.left).to.be.within(
            targetBoundingBox.left + targetBoundingBox.width - 1,
            targetBoundingBox.left + targetBoundingBox.width + 1
          );
          done();
        });
      });

      it('positions right _edge_ of target when offsetX:30', function (done) {
        tooltips.setConfig({defaults:{offsetX:30}});
        simulateSolid({
          place: 'right',
          targetStyles: {
            top: viewport.midY,
            left: viewport.midX
          }
        }, function (tipNode, tipBoundingBox, targetBoundingBox) {
          expect(tipBoundingBox.left).to.be.within(
            targetBoundingBox.left + targetBoundingBox.width + 29,
            targetBoundingBox.left + targetBoundingBox.width + 31
          );
          done();
        });
      });

      it('positions left _edge_ of target when offsetX:0', function (done) {
        tooltips.setConfig({defaults:{offsetX:0}});
        simulateSolid({
          place: 'left',
          targetStyles: {
            top: viewport.midY,
            left: viewport.midX
          }
        }, function (tipNode, tipBoundingBox, targetBoundingBox) {
          expect(tipBoundingBox.left).to.be.within(
            targetBoundingBox.left - tipBoundingBox.width - 1,
            targetBoundingBox.left - tipBoundingBox.width + 1
          );
          done();
        });
      });

      it('positions left _edge_ of target when offsetX:30', function (done) {
        tooltips.setConfig({defaults:{offsetX:30}});
        simulateSolid({
          place: 'left',
          targetStyles: {
            top: viewport.midY,
            left: viewport.midX
          }
        }, function (tipNode, tipBoundingBox, targetBoundingBox) {
          expect(tipBoundingBox.left).to.be.within(
            targetBoundingBox.left - tipBoundingBox.width - 31,
            targetBoundingBox.left - tipBoundingBox.width - 29
          );
          done();
        });
      });
    });

    context('when influenced by CSS classes', function () {
      var styleSheet;

      beforeEach(function () {
        reset();
        styleSheet = makeDummyStyleSheet();
      });

      afterEach(function () {
        cleanUp();
        destroyDummyStyleSheet();
      });

      /**
       * @todo: for some reason this is flaky when run on CI in Firefox;
       * running directly in browser via ?grep works ok.
       */
      it.skip('accounts CSS declarations affecting box size', function (done) {
        styleSheet.insertRule(
          '.tooltips-test-klass {padding:50px;margin:0 0 12px !important;}',
        0);

        tooltips.setConfig({
          defaults: {
            offsetY: 0,
            classes: ['tooltips-test-klass']
          }
        });

        simulateFloat({
          mouseX: viewport.midX,
          mouseY: viewport.midY
        }, function (tipNode, tipBoundingBox) {
          expect(tipBoundingBox.top).to.be.within(
            viewport.midY - (tipBoundingBox.height + 13),
            viewport.midY - (tipBoundingBox.height + 11)
          );
          done();
        });
      });

      /**
       * @todo: for some reason this is flaky when run on CI in Firefox;
       * running directly in browser via ?grep works ok.
       */
      it.skip('works with transition classes', function (done) {
        var offY = 13;
        tooltips.setConfig({
          defaults: {
            offsetY: offY
          }
        });
        styleSheet.insertRule(
          '.internetips {transition:margin-left 0.5s ease;margin-left:-40px;}',
          0
        );
        styleSheet.insertRule(
          '.internetips.internetips-show {margin-left:0;}', 0
        );

        simulateFloat({
          mouseX: viewport.midX,
          mouseY: viewport.midY
        }, function (tipNode) {
          tipNode.addEventListener('transitionend', function _transition() {
            tipNode.removeEventListener('transitionend', _transition);
            afterNextFrame(function () {
              var boundingRectAtEnd = tipNode.getBoundingClientRect();
              expect(boundingRectAtEnd.top).to.be.within(
                viewport.midY - (boundingRectAtEnd.height + offY + 1),
                viewport.midY - (boundingRectAtEnd.height + offY - 1)
              );
              expect(boundingRectAtEnd.left).to.be.within(
                viewport.midX - (boundingRectAtEnd.width / 2) - 1,
                viewport.midX - (boundingRectAtEnd.width / 2) + 1
              );
              done();
            });
          });
        });
      });
    });

  });

  function makeDummyStyleSheet() {
    // always destroy before creating to ensure there's only one
    destroyDummyStyleSheet();
    // make new stylesheet
    var styleSheet = document.createElement('style');
    styleSheet.id = 'tooltips-test-stylesheet';
    styleSheet.title = 'tooltips-test-stylesheet';
    styleSheet.type = 'text/css';
    document.head.appendChild(styleSheet);
    return _.filter(document.styleSheets, {
      title: 'tooltips-test-stylesheet'
    })[0];
  }

  function destroyDummyStyleSheet() {
    var styleSheet = _.filter(document.styleSheets, {
      title: 'tooltips-test-stylesheet'
    })[0];
    if (styleSheet) {
      styleSheet.disabled = true;
      styleSheet.ownerNode.parentNode.removeChild(styleSheet.ownerNode);
      styleSheet = null;
    }
  }

  /**************************************
   * Float tests
   *************************************/
  function floatShouldPlaceTopAuto(x, y) {
    it('float/top/auto/allowed', function (done) {
      simulateFloat({
        mouseX: x,
        mouseY: y
      }, function (tipNode, tipBoundingBox) {
        assertClass(tipNode, 'internetips-place-top');
        expect(tipBoundingBox.top).to.be.below(y - tipBoundingBox.height);
        done();
      });
    });
  }

  function floatShouldPlaceTopSpecified(x, y) {
    it('float/top/specified/allowed', function (done) {
      simulateFloat({
        place: 'top',
        mouseX: x,
        mouseY: y
      }, function (tipNode, tipBoundingBox) {
        assertClass(tipNode, 'internetips-place-top');
        expect(tipBoundingBox.top).to.be.below(y - tipBoundingBox.height);
        done();
      });
    });
  }

  function floatShouldNotPlaceTopAuto(x, y) {
    it('float/top/auto/disallowed', function (done) {
      simulateFloat({
        mouseX: x,
        mouseY: y
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-top');
        done();
      });
    });
  }

  function floatShouldNotPlaceTopSpecified(x, y) {
    it('float/top/specified/disallowed', function (done) {
      simulateFloat({
        place: 'top',
        mouseX: x,
        mouseY: y
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-top');
        done();
      });
    });
  }

  function floatShouldPlaceRightAuto(x, y) {
    it('float/right/auto/allowed', function (done) {
      simulateFloat({
        mouseX: x,
        mouseY: y
      }, function (tipNode, tipBoundingBox) {
        assertClass(tipNode, 'internetips-place-right');
        expect(tipBoundingBox.left).to.be.above(x);
        done();
      });
    });
  }

  function floatShouldPlaceRightSpecified(x, y) {
    it('float/right/specified/allowed', function (done) {
      simulateFloat({
        place: 'right',
        mouseX: x,
        mouseY: y
      }, function (tipNode, tipBoundingBox) {
        assertClass(tipNode, 'internetips-place-right');
        expect(tipBoundingBox.left).to.be.above(x);
        done();
      });
    });
  }

  function floatShouldNotPlaceRightAuto(x, y) {
    it('float/right/auto/disallowed', function (done) {
      simulateFloat({
        mouseX: x,
        mouseY: y
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-right');
        done();
      });
    });
  }

  function floatShouldNotPlaceRightSpecified(x, y) {
    it('float/right/specified/disallowed', function (done) {
      simulateFloat({
        place: 'right',
        mouseX: x,
        mouseY: y
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-right');
        done();
      });
    });
  }

  function floatShouldPlaceLeftAuto(x, y) {
    it('float/left/auto/allowed', function (done) {
      simulateFloat({
        mouseX: x,
        mouseY: y
      }, function (tipNode, tipBoundingBox) {
        assertClass(tipNode, 'internetips-place-left');
        expect(tipBoundingBox.left).to.be.below(x - tipBoundingBox.width);
        done();
      });
    });
  }

  function floatShouldPlaceLeftSpecified(x, y) {
    it('float/left/specified/allowed', function (done) {
      simulateFloat({
        place: 'left',
        mouseX: x,
        mouseY: y
      }, function (tipNode, tipBoundingBox) {
        assertClass(tipNode, 'internetips-place-left');
        expect(tipBoundingBox.left).to.be.below(x - tipBoundingBox.width);
        done();
      });
    });
  }

  function floatShouldNotPlaceLeftAuto(x, y) {
    it('float/left/auto/disallowed', function (done) {
      simulateFloat({
        mouseX: x,
        mouseY: y
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-left');
        done();
      });
    });
  }

  function floatShouldNotPlaceLeftSpecified(x, y) {
    it('float/left/specified/disallowed', function (done) {
      simulateFloat({
        place: 'left',
        mouseX: x,
        mouseY: y
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-left');
        done();
      });
    });
  }

  function floatShouldPlaceBottomAuto(x, y) {
    it('float/bottom/auto/allowed', function (done) {
      simulateFloat({
        mouseX: x,
        mouseY: y
      }, function (tipNode, tipBoundingBox) {
        assertClass(tipNode, 'internetips-place-bottom');
        expect(tipBoundingBox.top).to.be.above(y);
        done();
      });
    });
  }

  function floatShouldPlaceBottomSpecified(x, y) {
    it('float/bottom/specified/allowed', function (done) {
      simulateFloat({
        place: 'bottom',
        mouseX: x,
        mouseY: y
      }, function (tipNode, tipBoundingBox) {
        assertClass(tipNode, 'internetips-place-bottom');
        expect(tipBoundingBox.top).to.be.above(y);
        done();
      });
    });
  }

  function floatShouldNotPlaceBottomAuto(x, y) {
    it('float/bottom/auto/disallowed', function (done) {
      simulateFloat({
        mouseX: x,
        mouseY: y
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-bottom');
        done();
      });
    });
  }

  function floatShouldNotPlaceBottomSpecified(x, y) {
    it('float/bottom/specified/disallowed', function (done) {
      simulateFloat({
        place: 'bottom',
        mouseX: x,
        mouseY: y
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-bottom');
        done();
      });
    });
  }


  /**************************************
   * Solid tests
   *************************************/
  function solidShouldPlaceTopAuto(x, y) {
    it('solid/top/auto/allowed', function (done) {
      simulateSolid({
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode, tipBoundingBox, targetBoundingBox) {
        assertClass(tipNode, 'internetips-place-top');
        expect(tipBoundingBox.top).to.be.below(
          targetBoundingBox.top - tipBoundingBox.height
        );
        done();
      });
    });
  }

  function solidShouldPlaceTopSpecified(x, y) {
    it('solid/top/specified/allowed', function (done) {
      simulateSolid({
        place: 'top',
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode, tipBoundingBox, targetBoundingBox) {
        assertClass(tipNode, 'internetips-place-top');
        expect(tipBoundingBox.top).to.be.below(
          targetBoundingBox.top - tipBoundingBox.height
        );
        done();
      });
    });
  }

  function solidShouldNotPlaceTopAuto(x, y) {
    it('solid/top/auto/disallowed', function (done) {
      simulateSolid({
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-top');
        done();
      });
    });
  }

  function solidShouldNotPlaceTopSpecified(x, y) {
    it('solid/top/auto/disallowed', function (done) {
      simulateSolid({
        place: 'top',
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-top');
        done();
      });
    });
  }

  function solidShouldPlaceRightAuto(x, y) {
    it('solid/right/auto/allowed', function (done) {
      simulateSolid({
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode, tipBoundingBox, targetBoundingBox) {
        assertClass(tipNode, 'internetips-place-right');
        expect(tipBoundingBox.left).to.be.above(
          targetBoundingBox.left + targetBoundingBox.width // / 2?
        );
        done();
      });
    });
  }

  function solidShouldPlaceRightSpecified(x, y) {
    it('solid/right/specified/allowed', function (done) {
      simulateSolid({
        place: 'right',
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode, tipBoundingBox, targetBoundingBox) {
        assertClass(tipNode, 'internetips-place-right');
        expect(tipBoundingBox.left).to.be.above(
          targetBoundingBox.left + targetBoundingBox.width // / 2?
        );
        done();
      });
    });
  }

  function solidShouldNotPlaceRightAuto(x, y) {
    it('solid/right/auto/disallowed', function (done) {
      simulateSolid({
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-right');
        done();
      });
    });
  }

  function solidShouldNotPlaceRightSpecified(x, y) {
    it('solid/right/auto/disallowed', function (done) {
      simulateSolid({
        place: 'right',
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-right');
        done();
      });
    });
  }

  function solidShouldPlaceLeftAuto(x, y) {
    it('solid/left/auto/allowed', function (done) {
      simulateSolid({
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode, tipBoundingBox, targetBoundingBox) {
        assertClass(tipNode, 'internetips-place-left');
        expect(tipBoundingBox.left).to.be.below(
          targetBoundingBox.left - targetBoundingBox.width // / 2?
        );
        done();
      });
    });
  }

  function solidShouldPlaceLeftSpecified(x, y) {
    it('solid/left/specified/allowed', function (done) {
      simulateSolid({
        place: 'left',
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode, tipBoundingBox, targetBoundingBox) {
        assertClass(tipNode, 'internetips-place-left');
        expect(tipBoundingBox.left).to.be.below(
          targetBoundingBox.left - targetBoundingBox.width // / 2?
        );
        done();
      });
    });
  }

  function solidShouldNotPlaceLeftAuto(x, y) {
    it('solid/left/auto/disallowed', function (done) {
      simulateSolid({
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-left');
        done();
      });
    });
  }

  function solidShouldNotPlaceLeftSpecified(x, y) {
    it('solid/left/auto/disallowed', function (done) {
      simulateSolid({
        place: 'left',
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-left');
        done();
      });
    });
  }

  function solidShouldPlaceBottomAuto(x, y) {
    it('solid/bottom/auto/allowed', function (done) {
      simulateSolid({
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode, tipBoundingBox, targetBoundingBox) {
        assertClass(tipNode, 'internetips-place-bottom');
        expect(tipBoundingBox.top).to.be.above(
          targetBoundingBox.top + targetBoundingBox.height // / 2?
        );
        done();
      });
    });
  }

  function solidShouldPlaceBottomSpecified(x, y) {
    it('solid/bottom/specified/allowed', function (done) {
      simulateSolid({
        place: 'bottom',
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode, tipBoundingBox, targetBoundingBox) {
        assertClass(tipNode, 'internetips-place-bottom');
        expect(tipBoundingBox.top).to.be.above(
          targetBoundingBox.top + targetBoundingBox.height // / 2?
        );
        done();
      });
    });
  }

  function solidShouldNotPlaceBottomAuto(x, y) {
    it('solid/bottom/auto/disallowed', function (done) {
      simulateSolid({
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-bottom');
        done();
      });
    });
  }

  function solidShouldNotPlaceBottomSpecified(x, y) {
    it('solid/bottom/auto/disallowed', function (done) {
      simulateSolid({
        place: 'bottom',
        targetStyles: {
          top: y,
          left: x
        }
      }, function (tipNode) {
        assertNotClass(tipNode, 'internetips-place-bottom');
        done();
      });
    });
  }

  /**
   * Any options besides the standard tooltip defaults are just used for
   * tests and are ignored by the tooltip library.
   */
  function simulateFloat(options, then) {
    tooltips.show(_.merge({content:'test content'}, options || {}));
    mouseMove(options.mouseX, options.mouseY);
    afterNextFrame(function () {
      var tooltip = $qs('.internetips'),
        tipBoundingBox = tooltip.getBoundingClientRect();
      then(tooltip, tipBoundingBox);
    });
  }

  /**
   * Any options besides the standard tooltip defaults are just used for
   * tests and are ignored by the tooltip library.
   */
  function simulateSolid(options, then) {
    var target = targetBox(options.targetStyles);
    tooltips.show(_.merge({
      content: 'test content',
      effect: 'solid',
      target: target
    }, options));
    afterNextFrame(function () {
      var tooltip = $qs('.internetips'),
        tipBoundingBox = tooltip.getBoundingClientRect(),
        targetBoundingBox = target.getBoundingClientRect();
      then(tooltip, tipBoundingBox, targetBoundingBox);
    });
  }

  /**
   * Get or make a dummy node to use as a target
   */
  function targetBox(styles) {
    var styleString = 'background:#9a9a9a;position:absolute;width:50px;' +
      'height:50px;z-index:99;';
    if (!targetBox.node) {
      targetBox.node = document.createElement('div');
      document.body.appendChild(targetBox.node);
    }
    if (styles) {
      _.forOwn(styles, function (value, key) {
        styleString += key + ':' + parseInt(value) + 'px;';
      });
    }
    targetBox.node.style.cssText = styleString;
    return targetBox.node;
  }

  /**
   * Remove said dummy node
   */
  targetBox.remove = function () {
    if (targetBox.node) {
      targetBox.node.parentNode.removeChild(targetBox.node);
      targetBox.node = null;
    }
  };

  /**
   * Assert tooltip node has a class
   */
  function assertClass(node, klass) {
    assert.ok(node.classList.contains(klass),
      'tooltip should have class ' + klass + ' on ' + node.classList
    );
  }

  /**
   * Assert tooltip node *does not* have a class
   */
  function assertNotClass(node, klass) {
    assert.ok(node.classList.contains(klass) === false,
      'tooltip should not have class ' + klass
    );
  }

});
