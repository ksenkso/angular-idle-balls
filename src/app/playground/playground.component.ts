import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import Vector from '../Vector';
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

  private raq: number;
  private rect: ClientRect;
  public isPaused: boolean;
  private useMouseInterval: number;
  private useMouseTimeout: number;

  constructor(
    private playgroundService: PlaygroundService,
    private ballsService: BallsService,
  ) {

    this.playgroundService.isPaused$.subscribe(isPaused => {
      if (isPaused) {
        this.pause();
      } else {
        this.run();
      }
    });

  }

  @ViewChild('canvas', {read: ElementRef}) canvas: ElementRef;

  ngAfterViewInit(): void {
    this.playgroundService.ctx = this.canvas.nativeElement.getContext('2d');
    this.playgroundService.sizes = {
      width: this.canvas.nativeElement.width,
      height: this.canvas.nativeElement.height,
    };
    // only need to create balls in service, this handles all the positioning
    this.ballsService.balls$.value.forEach(ball => {
      ball.ctx = this.playgroundService.ctx;
      const pos = this.playgroundService.placeBall(5);
      if (pos) {
        ball.pos = new Vector(pos.x, pos.y);
      } else {
        throw new Error('NO PLACE!!!');
      }
    });
    this.ballsService.balls$.subscribe((balls: Ball[]) => {
      if (!balls.length) {
        return;
      }
      const pos = this.playgroundService.placeBall(5);
      if (pos) {
        balls[balls.length - 1].pos = new Vector(pos.x, pos.y);
      } else {
        throw new Error('NO PLACE!!!');
      }
    });
    this.playgroundService.placeEnemies();
    this.initClickInteractions();
  }

  run(): void {
    this.isPaused = false;
    requestAnimationFrame(this.tick.bind(this));
  }

  tick(): void {
    this.playgroundService.ctx.clearRect(0, 0, 500, 800);
    // this.ballsService.moveParticles();
    this.playgroundService.enemies.forEach(e => {
      if (e.particles) {
        e.particles.tick();
      }
      e.render();
    });
    this.ballsService.balls$.value.forEach(b => {
      b.render();
      b.tick(this.playgroundService.sizes);
      let i = 0;
      for (; i < this.playgroundService.enemies.length; i++) {
        const enemy = this.playgroundService.enemies[i];
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

  private useMouseOnEnemy(e: MouseEvent): void {
    const mousePos = this.getMouseCoords(e);
    const targetEnemy = this.playgroundService.enemies.find(enemy => enemy.contains(mousePos));
    if (targetEnemy) {
      targetEnemy.emitParticles();
      this.playgroundService.addScore(Math.min(this.ballsService.getBallType(BALL_TYPE.Click).damage.value$.value, targetEnemy.points));
      targetEnemy.getDamage(this.ballsService.getBallType(BALL_TYPE.Click).damage.value$.value);
    }
  }

  private getMouseCoords(e: MouseEvent): { x: number, y: number } {
    return {
      x: e.clientX - this.rect.left,
      y: e.clientY - this.rect.top
    };
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
      if (this.playgroundService.enemies.some(enemy => enemy.contains(mousePos))) {
        this.canvas.nativeElement.style.cursor = 'pointer';
      } else {
        this.canvas.nativeElement.style.cursor = 'default';
      }
    });
    this.canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      this.useMouseOnEnemy(e);
      this.useMouseTimeout = setTimeout(() => {
        this.useMouseTimeout = null;
        this.useMouseInterval = setInterval(this.useMouseOnEnemy.bind(this, e), 1000 / 6);
      }, 1100 / 6);
    });

    document.addEventListener('mouseup', () => {
      if (this.useMouseTimeout) {
        clearTimeout(this.useMouseTimeout);
      }
      clearInterval(this.useMouseInterval);
    });
  }
}
