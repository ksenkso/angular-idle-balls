import {BehaviorSubject} from 'rxjs';

export default class UpgradeStrategy {
  public value$: BehaviorSubject<number>;
  public level: number;
  private readonly base: number;
  private readonly factor: number;

  get next(): number {
    return this.calculate(this.level + 1);
  }

  constructor(value: number, factor = 1.1) {
    this.value$ = new BehaviorSubject(value);
    this.level = 1;
    this.factor = factor;
    this.base = value;
  }

  calculate(level: number): number {
    return Math.max(Math.round(this.base * this.factor ** (level)), this.value$.value + 1);
  }

  upgrade(): void {
    this.level++;
    this.value$.next(this.calculate(this.level));
  }

}
