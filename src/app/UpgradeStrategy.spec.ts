import UpgradeStrategy from './UpgradeStrategy';
import {TestScheduler} from 'rxjs/testing';
import {skip} from 'rxjs/operators';

describe('UpgradeStrategy', () => {
  let strategy: UpgradeStrategy;
  let scheduler: TestScheduler;
  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    strategy = new UpgradeStrategy({
      value: 1,
      factor: 1.1,
      level: 1,
    });
  });
  it('should calculate correct value on level 1', () => {
    expect(strategy.calculate(strategy.level)).toEqual(strategy.value$.value);
  });

  it('should upgrade at least by 1 point', (done) => {
    expect(strategy.value$.value).toEqual(1);
    strategy.value$.pipe(skip(1)).subscribe(value => {
      expect(value).toEqual(2);
      done();
    });
    strategy.upgrade();
  });

  it('should upgrade to eny level', (done) => {
    expect(strategy.value$.value).toEqual(1);
    strategy.value$.pipe(skip(1)).subscribe(value => {
      expect(value).toEqual(strategy.calculate(42));
      done();
    });
    strategy.upgrade(42);
  });
});
