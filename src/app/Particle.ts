import Vector, {Point2D} from './Vector';

type ParticleConfig = {
  pos: Point2D,
  ctx: CanvasRenderingContext2D,
  angle: number,
  destroy: () => void,
};

export default class Particle {
  static radius = 3;
  static maxTicks = 20;
  private readonly angle: number;
  private readonly velocity: Vector;
  private readonly destroy: () => void;
  private ctx: CanvasRenderingContext2D;
  private pos: Point2D;
  private fillStyle: string;

  constructor({ctx, angle, destroy, pos}: ParticleConfig) {
    this.destroy = destroy;
    this.ctx = ctx;
    this.angle = angle;
    this.velocity = Vector.setLength(Vector.setAngle(new Vector(1, 0), this.angle), 2);
    this.pos = Vector.add(pos, this.velocity);
    this.fillStyle = `rgba(255, 255, 255, 1)`;
  }

  tick(opacity: number): void {
    this.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    this.pos = Vector.add(this.pos, this.velocity);
  }

  render(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, Particle.radius, 0, Math.PI * 2);
    this.ctx.closePath();
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fill();
  }
}
