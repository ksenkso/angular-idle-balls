import Vector, {Point2D} from './Vector';
export type EnemyBallConfig = {
  pos: Point2D,
  fill?: string,
  points: number,
  onDestroy: (ball: EnemyBall) => void,
  initialPoints?: number,
};
export default class EnemyBall {

  static radius = 18;
  public pos: Vector;
  points: number;
  private fill: string;
  private readonly onDestroy: (ball: EnemyBall) => void;
  private readonly initialPoints: number;
  constructor({pos, points, onDestroy, fill = 'hsl(0, 75%, 45%)', initialPoints}: EnemyBallConfig) {
    this.pos = new Vector(pos.x, pos.y);
    this.fill = fill;
    this.points = points;
    this.initialPoints = initialPoints ?? points;
    this.onDestroy = onDestroy;
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
    return this.points.toString();
  }

  getDamage(damage: number): void {
    this.points -= damage;
    this.calculateColor();
    if (this.points <= 0) {
      this.onDestroy(this);
    }
  }

  private calculateColor(): void {
    this.fill = `hsl(${(this.initialPoints - this.points) / this.initialPoints * 180}, 75%, 45%)`;
  }
}
