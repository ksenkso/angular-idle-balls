import Vector, {Point2D} from './Vector';
import {formatPoints} from './utils';

export type EnemyBallConfig = {
  pos: Point2D,
  fill?: string,
  points: number,
  onDestroy?: (ball: EnemyBall) => void,
  initialPoints?: number,
  ctx?: CanvasRenderingContext2D,
};

export default class EnemyBall {

  static radius = 18;
  pos: Vector;
  ctx: CanvasRenderingContext2D;
  points: number;
  isPressed = false;
  private fill: string;
  private readonly onDestroy: (ball: EnemyBall) => void;
  private readonly initialPoints: number;


  constructor({ctx, pos, points, onDestroy, fill = 'hsl(0, 75%, 45%)', initialPoints}: EnemyBallConfig) {
    this.ctx = ctx;
    this.pos = new Vector(pos.x, pos.y);
    this.fill = fill;
    this.points = points;
    this.initialPoints = initialPoints ?? points;
    this.onDestroy = onDestroy;
  }

  render(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, EnemyBall.radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fillStyle = this.fill;
    this.ctx.fill();
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'regular 8px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(formatPoints(this.points), this.pos.x, this.pos.y);
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

  contains(point: { x: number; y: number }): boolean {
    return Math.hypot(this.pos.x - point.x, this.pos.y - point.y) < EnemyBall.radius;
  }

  serialize(): EnemyBallConfig {
    return {
      pos: this.pos,
      points: this.points,
      initialPoints: this.initialPoints,
      fill: this.fill,
    };
  }
}
