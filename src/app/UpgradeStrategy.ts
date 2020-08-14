import {BehaviorSubject} from 'rxjs';

export type UpgradeStrategyConfig = {
  factor: number,
  level: number,
  value?: number,
  base?: number,
};

export default class UpgradeStrategy {
  public value$: BehaviorSubject<number>;
  private $level: number;
  private readonly base: number;
  private readonly factor: number;

  get next(): number {
    return this.calculate(this.level + 1);
  }

  get level(): number {
    return this.$level;
  }

  set level(value: number) {
    this.$level = value;
    this.value$.next(this.calculate(this.$level));
  }

  constructor({value, factor = 1.1, level = 1, base = value}: UpgradeStrategyConfig) {
    this.factor = factor;
    this.base = base;
    this.$level = level;
    if (value === undefined && level !== undefined) {
      value = this.calculate(level);
    }
    this.value$ = new BehaviorSubject(value);
  }

  calculate(level: number): number {
    return Math.max(Math.round(this.base * this.factor ** (level - 1)), this.value$ ? this.value$.value + 1 : 0);
  }

  upgrade(level?: number): void {
    if (level) {
      this.level = level;
    } else {
      this.level++;
    }
  }
}
