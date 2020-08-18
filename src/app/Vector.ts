export type Point2D = {
  x: number;
  y: number;
};

export default class Vector {

  public x: number;
  public y: number;

  get length(): number {
    return Math.hypot(this.x, this.y);
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static randomNormalized(): Vector {
    return Vector.normalize(new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1));
  }

  static normalize(v: Vector): Vector {
    const l = v.length;
    return new Vector(v.x / l, v.y / l);
  }

  static setLength(v: Vector, l: number): Vector {
    return Vector.scale(Vector.normalize(v), l);
  }

  static scale(v: Point2D, n: number): Vector {
    return new Vector(n * v.x, n * v.y);
  }

  static setAngle(v: Vector, angle: number): Vector {
    const l = v.length;
    const nv = new Vector(Math.cos(angle), Math.sin(angle));
    return Vector.setLength(nv, l);
  }

  static rotate(v: Vector, deg: number): Vector {
    const l = v.length;
    const nv = new Vector(
      v.x * Math.cos(deg),
      v.y * Math.sin(deg)
    );
    return Vector.scale(nv, nv.length / l);
  }

  static getAngle(v: Point2D): number {
    return Math.atan2(v.y, v.x);
  }

  static dot(v1: Vector, v2: Vector): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static getAngleBetween(v1: Vector, v2: Vector): number {
    return Math.acos(Vector.getCosine(v1, v2));
  }

  static getCosine(v1: Vector, v2: Vector): number {
    return Vector.dot(v1, v2) / (v1.length * v2.length);
  }


  static add(v1: Point2D, v2: Point2D): Vector {
    return new Vector(
      v1.x + v2.x,
      v1.y + v2.y
    );
  }

  static sub(v1: Point2D, v2: Point2D): Vector {
    return new Vector(
      v1.x - v2.x,
      v1.y - v2.y
    );
  }
}
