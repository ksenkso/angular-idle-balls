import {Point2D} from './Vector';
import EnemyBall from './EnemyBall';
import Particle from './Particle';

export default class Particles {
  static radius = 3;
  static maxTicks = 30;
  private readonly ctx: CanvasRenderingContext2D;
  private pos: Point2D;
  private tickCount: number;
  private objects: Particle[];
  private readonly destroyParticles: () => void;

  constructor(enemy: EnemyBall) {
    this.ctx = enemy.ctx;
    this.pos = enemy.pos;
    this.tickCount = 0;
    this.destroyParticles = enemy.destroyParticles;
    this.objects = Array(18).fill(0)
      .map((_, i) => new Particle({
        angle: Math.PI * 2 / 18 * i,
        ctx: this.ctx,
        destroy: () => this.objects.splice(i, 1),
        pos: enemy.pos
      }));
  }

  tick(): void {
    this.tickCount++;
    if (this.tickCount === Particles.maxTicks) {
      this.destroyParticles();
    } else {
      this.objects.forEach(object => {
        object.tick(1 - this.tickCount / Particles.maxTicks);
        object.render();
      });
    }
  }
}
