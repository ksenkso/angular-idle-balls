import EnemyBall from './EnemyBall';
import Vector, {Point2D} from './Vector';
import {RectSize} from './playground/RectSize';
import * as PIXI from 'pixi.js';
import {CircleData, ICircle} from './CircleData';

export type BallConfig = {
  ctx?: CanvasRenderingContext2D,
  pos?: Point2D,
  fill?: string,
  damage?: number,
  image?: HTMLImageElement
};

export interface IBallType {
  damage: number;
  spriteUrl: string;
  radius?: number;
}

export interface IBall extends ICircle {
  setPosition(position: PIXI.IPointData): void;
  setVelocity(velocity: Vector): void;
  getDamage(): number;
}

export class Ball extends PIXI.Container implements IBall, ICircle {
  public static readonly RADIUS = 7;

  rotationSpeed = 0;

  private readonly _radius: number;
  private _damage: number;
  private _position: PIXI.ObservablePoint;
  private _image: PIXI.Sprite;
  private _velocity = Vector.zero;
  private _collides = false;

  constructor(ballType: IBallType) {
    super();
    this._radius = ballType.radius || Ball.RADIUS;
    this._damage = ballType.damage;
    this._position = new PIXI.ObservablePoint(() => {
      this._image.position.set(this._position.x, this._position.y);
    }, null);
    this._createImage(ballType);
  }

  collidePlayground(sizes: RectSize): void {
    const normals = [];
    //left side
    if ((this._position.x - this._radius) <= 0) {
      normals.push(new Vector(1, 0));
      this._setRotationSpeed(new Vector(-1, 0));
    }
    // right side
    if ((this._position.x + this._radius) >= sizes.width) {
      normals.push(new Vector(-1, 0));
      this._setRotationSpeed(new Vector(1, 0));
    }
    // bottom side
    if ((this._position.y + this._radius) >= sizes.height) {
      normals.push(new Vector(0, -1));
      this._setRotationSpeed(new Vector(0, 1));
    }
    // top side
    if ((this._position.y - this._radius) <= 0) {
      normals.push(new Vector(0, 1));
      this._setRotationSpeed(new Vector(0, -1));
    }
    if (normals.length) {
      const resultNormal = Vector.normalize(normals.reduce((acc, normal) => Vector.add(acc, normal)));
      this._velocity = Vector.sub(this._velocity, Vector.scale(resultNormal, 2 * Vector.dot(this._velocity, resultNormal)));
      this._collides = true;
    }
  }

  collidesCircle(circle: ICircle): boolean {
    const circleData = circle.getDimensions();
    const distance = Vector.sub(this._position, circleData).length;

    return distance <= this._radius + circleData.radius;
  }

  reboundFromEnemy (enemy: CircleData) {
    const normalToEnemy = Vector.normalize(Vector.sub(this._position, enemy));
    this._velocity = Vector.setLength(
      Vector.sub(
        this._velocity,
        Vector.scale(normalToEnemy, 2 * Vector.dot(this._velocity, normalToEnemy))
      ),
      OldBall.speed
    );
    this.stepInCurrentDirection();
  }

  setPosition(position: PIXI.IPointData): void {
    this._position.set(position.x, position.y);
  }

  setVelocity(velocity: Vector): void {
    this._velocity = velocity;
  }

  getDimensions(): CircleData {
    return {
      x: this._position.x,
      y: this._position.y,
      radius: this._radius,
    };
  }

  getDamage(): number {
    return this._damage;
  }

  stepInCurrentDirection() {
    this.setPosition({
      x: this._position.x + this._velocity.x,
      y: this._position.y + this._velocity.y,
    });
  }

  private _createImage(ballType: IBallType) {
    this._image = PIXI.Sprite.from(ballType.spriteUrl);
    this._image.width = this._radius * 2;
    this._image.height = this._radius * 2;
    this._image.anchor.set(0.5, 0.5);
    this._image.position.copyFrom(this._position);
    this.addChild(this._image);
  }

  private _setRotationSpeed(posVector: Vector) {
    let angle = Vector.getAngleBetween(this._velocity, posVector);
    const det = this._velocity.x * posVector.y - this._velocity.y * posVector.x;
    if (det > 0) {
      angle = -angle;
    }
    // extrapolate the angle speed to domain [-0.1; 0.1]
    let newSpeed = this.rotationSpeed + angle / Math.PI / 10;
    if (Math.abs(newSpeed) > 0.1) {
      newSpeed = Math.sign(newSpeed) * 0.1;
    }
    this.rotationSpeed = newSpeed;
  }
}

export default class OldBall {
  public static defaultRadius = 7;
  public static speed = 3;
  public velocity: Vector;
  public damage: number;
  public pos: Vector;
  public ctx: CanvasRenderingContext2D;
  public radius = OldBall.defaultRadius;
  public angle = 0;
  public angleSpeed = 0.1;
  private readonly fill: string = '#000000';
  private readonly image: HTMLImageElement;
  private collides = false;


  constructor({ctx, pos = {x: 0, y: 0}, fill = '#000000', damage = 10, image}: BallConfig) {
    this.ctx = ctx;
    this.fill = fill;
    this.pos = new Vector(pos.x, pos.y);
    this.velocity = Vector.setLength(Vector.randomNormalized(), OldBall.speed);
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
        OldBall.speed
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
