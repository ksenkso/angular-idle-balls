import EnemyBall from './EnemyBall.js';
import Vector, {Point2D} from './Vector';
import {RectSize} from './playground/playground.component';

export type BallConfig = {
  ctx?: CanvasRenderingContext2D,
  pos?: Point2D,
  fill?: string,
  damage?: number,
};
export default class Ball {
  public static speed = 1.5;
  private velocity: Vector;
  public damage: number;
  public pos: Vector;
  public ctx: CanvasRenderingContext2D;
  public radius = 5;
  private readonly fill: string = '#000000';

  constructor({ctx, pos = {x: 0, y: 0}, fill = '#000000', damage = 10}: BallConfig) {
    this.ctx = ctx;
    this.fill = fill;
    this.radius = 5;
    this.pos = new Vector(pos.x, pos.y);
    this.velocity = Vector.setLength(Vector.randomNormalized(), Ball.speed);
    this.damage = damage;
  }

  tick(sizes: RectSize): void {
    this.pos = Vector.add(this.pos, this.velocity);
    this.collide(sizes);
  }

  collide(sizes: RectSize): void {
    let n = null;
    if ((this.pos.x - this.radius) < 0) {
      n = new Vector(1, 0);
    }
    if ((this.pos.x + this.radius) > sizes.width) {
      n = new Vector(-1, 0);
    }
    if ((this.pos.y + this.radius) > sizes.height) {
      n = new Vector(0, -1);
    }
    if ((this.pos.y - this.radius) < 0) {
      n = new Vector(0, 1);
    }
    if (n) {
      this.velocity = Vector.sub(this.velocity, Vector.scale(n, 2 * Vector.dot(this.velocity, n)));
    }
  }

  collideEnemy(enemy: EnemyBall): boolean {
    if (Math.hypot(this.pos.x - enemy.pos.x, this.pos.y - enemy.pos.y) < (EnemyBall.radius + this.radius)) {
      const n = Vector.normalize(Vector.sub(this.pos, enemy.pos));
      this.velocity = Vector.setLength(
        Vector.sub(
          this.velocity,
          Vector.scale(n, 2 * Vector.dot(this.velocity, n))
        ),
        Ball.speed
      );
      this.pos = Vector.add(this.pos, this.velocity);

      return true;
    }
  }


  render(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    this.ctx.closePath();
    this.ctx.fillStyle = this.fill;
    this.ctx.fill();
  }
}
