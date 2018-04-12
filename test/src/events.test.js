import * as tooltips from '../../lib';
import { expect } from 'chai';

describe('tooltips events', function () {
  this.timeout(1000000);
  let target;

  beforeEach(tooltips.destroy);
  afterEach(tooltips.destroy);

  beforeEach(function () {
    target = document.createElement('p');
    target.style.display = 'inline-block';
    target.style.background = '#e1e1e1';
    target.innerText = 'this is a test target';
    document.body.appendChild(target);
  });

  afterEach(function () {
    target && target.parentNode.removeChild(target);
    target = null;
  });

  it('should trigger reset (hide) on window scroll', function (done) {
    tooltips.show({
      content: 'yolo',
      target: target
    });

    const tip = document.querySelector('.internetips');
    expect(tip.innerHTML).to.contain('yolo');

    tooltips._defineTestHooks({
      onReset() {
        tooltips._defineTestHooks();
        expect(tip.innerText).to.be.empty;
        done();
      }
    });

    window.dispatchEvent(new Event('scroll'));
  });

  it('should trigger reset (hide) on body scroll', function (done) {
    tooltips.show({
      content: 'yolo2',
      target: target
    });

    const tip = document.querySelector('.internetips');
    expect(tip.innerHTML).to.contain('yolo2');

    tooltips._defineTestHooks({
      onReset() {
        tooltips._defineTestHooks();
        expect(tip.innerText).to.be.empty;
        done();
      }
    });

    document.body.dispatchEvent(new Event('scroll'));
  });
});