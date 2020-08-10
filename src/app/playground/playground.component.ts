import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import Vector, {Point2D} from '../Vector';
import EnemyBall from '../EnemyBall';
import Ball from '../Ball';
import {PlaygroundService} from '../playground.service';
import {BallsService} from '../balls.service';
import {BALL_TYPE} from '../BallType';

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
  private rect: ClientRect;
  public isPaused: boolean;
  public levelPoints = 1;
  public progress = 0;

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
    this.placeEnemies();
    this.initClickInteractions();
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
        const ball = new EnemyBall({
          pos,
          points: Math.floor(this.playgroundService.pointsInEnemies.value$.value),
          onDestroy: this.onEnemyDestroy.bind(this),
        });
        this.enemies.push(ball);
        ball.render(this.ctx);
      } else {
        break;
      }
    }
    const total = this.playgroundService.pointsInEnemies.value$.value * 40;
    this.playgroundService.setLevelTotal(total);
  }

  run(): void {
    this.isPaused = false;
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
      let i = 0;
      for (; i < this.enemies.length; i++) {
        const enemy = this.enemies[i];
        if (b.collideEnemy(enemy)) {
          this.playgroundService.addScore(Math.min(b.damage, enemy.points));
          enemy.getDamage(b.damage);
          break;
        }
      }
    });
    this.raq = requestAnimationFrame(this.tick.bind(this));
  }

  pause(): void {
    this.isPaused = true;
    cancelAnimationFrame(this.raq);
  }

  private nextLevel(): void {
    this.placeEnemies();
  }

  private initClickInteractions(): void {
    this.rect = this.canvas.nativeElement.getBoundingClientRect();
    window.addEventListener('resize', () => {
      this.rect = this.canvas.nativeElement.getBoundingClientRect();
    });
    this.canvas.nativeElement.addEventListener('mousemove', (e: MouseEvent) => {
      const mousePos = {
        x: e.clientX - this.rect.left,
        y: e.clientY - this.rect.top
      };
      if (this.enemies.some(enemy => enemy.contains(mousePos))) {
        this.canvas.nativeElement.style.cursor = 'pointer';
      } else {
        this.canvas.nativeElement.style.cursor = 'default';
      }
    });
    this.canvas.nativeElement.addEventListener('click', (e: MouseEvent) => {
      const mousePos = {
        x: e.clientX - this.rect.left,
        y: e.clientY - this.rect.top
      };
      const clickedEnemy = this.enemies.find(enemy => enemy.contains(mousePos));
      if (clickedEnemy) {
        this.playgroundService.addScore(Math.min(this.ballsService.ballTypes[BALL_TYPE.Click].damage.value$.value, clickedEnemy.points));
        clickedEnemy.getDamage(this.ballsService.ballTypes[BALL_TYPE.Click].damage.value$.value);
      }
    });
  }
}
