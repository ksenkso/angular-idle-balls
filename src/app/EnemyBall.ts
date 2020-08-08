import Vector from './Vector';

export default class EnemyBall {

  static radius = 18;

  constructor(public pos: Vector, private fill: string, public cash: number = 20, public onDestroy: (ball: EnemyBall) => any) {
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, EnemyBall.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = this.fill;
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    const text = this.formatCash();
    ctx.font = 'regular 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, this.pos.x, this.pos.y);
  }

  formatCash(): string {
    return this.cash.toString();
  }

  getDamage(damage: number): void {
    this.cash -= damage;
    if (this.cash <= 0) {
      this.onDestroy(this);
    }
  }
}
