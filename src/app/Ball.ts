import EnemyBall from './EnemyBall.js';
import Vector, {Point2D} from './Vector';
import {RectSize} from './playground/playground.component';

export type BallConfig = {
  ctx?: CanvasRenderingContext2D,
  pos?: Point2D,
  fill?: string,
  damage?: number,
  image?: HTMLImageElement
};
export default class Ball {
  public static defaultRadius = 7;
  public static speed = 4;
  public velocity: Vector;
  public damage: number;
  public pos: Vector;
  public ctx: CanvasRenderingContext2D;
  public radius = Ball.defaultRadius;
  public angle = 0;
  public angleSpeed = 0.1;
  private readonly fill: string = '#000000';
  private readonly image: HTMLImageElement;
  private collides = false;


  constructor({ctx, pos = {x: 0, y: 0}, fill = '#000000', damage = 10, image}: BallConfig) {
    this.ctx = ctx;
    this.fill = fill;
    this.pos = new Vector(pos.x, pos.y);
    this.velocity = Vector.setLength(Vector.randomNormalized(), Ball.speed);
    this.damage = damage;
    this.image = image;
  }

  tick(sizes: RectSize): void {
    this.pos = Vector.add(this.pos, this.velocity);
    // clamp position
    this.pos.x = this.pos.x - this.radius <= 0
      ? this.radius + 1
      : this.pos.x + this.radius >= sizes.width
        ? sizes.width - this.radius - 1
        : this.pos.x;
    this.pos.y = this.pos.y - this.radius <= 0
      ? this.radius + 1
      : this.pos.y + this.radius >= sizes.height
        ? sizes.height - this.radius - 1
        : this.pos.y;
    this.angle += this.angleSpeed;
    this.collide(sizes);
  }

  collide(sizes: RectSize): void {
    const normals = [];
    if ((this.pos.x - this.radius) <= 1) {
      normals.push(new Vector(1, 0));
      this.updateAngleSpeed(new Vector(-1, 0));
    }
    // right side
    if ((this.pos.x + this.radius) >= sizes.width - 1) {
      normals.push(new Vector(-1, 0));
      this.updateAngleSpeed(new Vector(1, 0));
    }
    // bottom side
    if ((this.pos.y + this.radius) >= sizes.height - 1) {
      normals.push(new Vector(0, -1));
      this.updateAngleSpeed(new Vector(0, 1));
    }
    // top side
    if ((this.pos.y - this.radius) <= 1) {
      normals.push(new Vector(0, 1));
      this.updateAngleSpeed(new Vector(0, -1));
    }
    if (normals.length) {
      const resultNormal = Vector.normalize(normals.reduce((acc, normal) => Vector.add(acc, normal)));
      this.velocity = Vector.sub(this.velocity, Vector.scale(resultNormal, 2 * Vector.dot(this.velocity, resultNormal)));
      this.collides = true;
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
    this.ctx.save();
    this.ctx.translate(this.pos.x, this.pos.y);
    this.ctx.rotate(this.angle);
    this.ctx.drawImage(
      this.image,
      0, 0,
      128, 128,
      -this.radius,
      -this.radius,
      2 * this.radius,
      2 * this.radius);
    this.ctx.translate(-this.pos.x, -this.pos.y);
    this.ctx.restore();
  }

  updateAngleSpeed(posVector: Vector): void {
    let angle = Vector.getAngleBetween(this.velocity, posVector);
    const det = this.velocity.x * posVector.y - this.velocity.y * posVector.x;
    if (det > 0) {
      angle = -angle;
    }
    // extrapolate the angle speed to domain [-0.1; 0.1]
    let newSpeed = this.angleSpeed + angle / Math.PI / 10;
    if (Math.abs(newSpeed) > 0.1) {
      newSpeed = Math.sign(newSpeed) * 0.1;
    }
    this.angleSpeed = newSpeed;
  }
}
