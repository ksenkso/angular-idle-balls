import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import Vector, {Point2D} from '../Vector';
import EnemyBall from '../EnemyBall';
import Ball from '../Ball';
import {PlaygroundService} from '../playground.service';
import {BallsService} from '../balls.service';

export type RectSize = {
  width: number,
  height: number
};

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements AfterViewInit {
  private sizes: RectSize = null;
  private enemies: EnemyBall[] = [];
  private raq: number;

  constructor(
    private playgroundService: PlaygroundService,
    private ballsService: BallsService,
  ) {
    this.ballsService.balls$.subscribe((balls: Ball[]) => {
      if (!balls.length) {
        return;
      }
      const pos = this.placeBall(5);
      if (pos) {
        balls[balls.length - 1].pos = new Vector(pos.x, pos.y);
      } else {
        throw new Error('NO PLACE!!!');
      }
    });
    this.playgroundService.isPaused$.subscribe(isPaused => {
      if (isPaused) {
        this.pause();
      } else {
        this.run();
      }
    });
  }

  @ViewChild('canvas', {read: ElementRef}) canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.sizes = {
      width: this.canvas.nativeElement.width,
      height: this.canvas.nativeElement.height,
    };
    console.log(this.sizes);
    this.placeEnemies();
  }

  placeBall(r = EnemyBall.radius): Point2D {
    let pos;
    let tries = 0;
    do {
      pos = {
        x: Math.random() * (this.sizes.width - 50) + 18,
        y: Math.random() * (this.sizes.height - 50) + 18,
      };
      tries++;
      if (tries > 500) {
        console.log(`i'm tired`);
        return null;
      }
    }
    while (this.enemies.some(b => {
      return Math.hypot(b.pos.x - pos.x, b.pos.y - pos.y) < (EnemyBall.radius + r + 10);
    }));
    return pos;
  }

  onEnemyDestroy(ball: EnemyBall): void {
    const index = this.enemies.findIndex(e => e === ball);
    this.enemies.splice(index, 1);
    if (!this.enemies.length) {
      this.nextTick(() => {
        this.playgroundService.nextLevel();
        this.nextLevel();
      });
    }
  }

  placeEnemies(): void {
    for (let i = 0; i < 40; i++) {
      const pos = this.placeBall();
      if (pos) {
        const ball = new EnemyBall(
          pos,
          '#dd380a',
          Math.floor(this.playgroundService.pointsInEnemies.value),
          this.onEnemyDestroy.bind(this)
        );
        this.enemies.push(ball);
        ball.render(this.ctx);
      } else {
        return;
      }
    }
  }

  run(): void {
    requestAnimationFrame(this.tick.bind(this));
  }

  nextTick(cb): void {
    setTimeout(cb, 8);
  }

  tick(): void {
    this.ctx.clearRect(0, 0, 500, 800);
    this.enemies.forEach(e => {
      e.render(this.ctx);
    });
    this.ballsService.balls$.value.forEach(b => {
      b.render(this.ctx);
      b.tick(this.sizes);
      if (this.enemies.some(enemy => b.collideEnemy(enemy))) {
        this.playgroundService.addScore(b.damage);
      }
    });
    this.raq = requestAnimationFrame(this.tick.bind(this));
  }

  pause(): void {
    cancelAnimationFrame(this.raq);
  }

  private nextLevel(): void {
    this.placeEnemies();
  }
}
