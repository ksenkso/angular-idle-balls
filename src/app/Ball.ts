import EnemyBall from './EnemyBall.js';
import Vector from './Vector';
import {RectSize} from './playground/playground.component';

export default class Ball {
  private velocity: Vector;
  public readonly damage: number;

  constructor(public pos: Vector, public radius: number = 5, private fill: string = '#000000') {
    this.velocity = Vector.randomNormalized();
    this.damage = 10;
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
      this.velocity = Vector.sub(this.velocity, Vector.scale(n, 2 * Vector.dot(this.velocity, n)));
      this.pos = Vector.add(this.pos, this.velocity);
      enemy.getDamage(this.damage);
      return true;
    }
  }


  render(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
}
