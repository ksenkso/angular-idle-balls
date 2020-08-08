export default class UpgradeStrategy {
  public value: number;
  public level: number;
  private readonly factor: number;

    get next(): number {
        return this.calculate(this.level + 1);
    }

    constructor(value: number, factor = 1.1) {
        this.value = value;
        this.level = 1;
        this.factor = factor;
    }

    calculate(level: number): number {
        return this.value * this.factor ** (level);
    }

    upgrade(): void {
        this.level++;
        this.value = this.calculate(this.level);
    }

}
