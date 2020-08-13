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
  public progress = 0;

  constructor(
    private playgroundService: PlaygroundService,
    private ballsService: BallsService,
  ) {
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
    this.playgroundService.sizes = {
      width: this.canvas.nativeElement.width,
      height: this.canvas.nativeElement.height,
    };
    this.playgroundService.placeEnemies();
    this.initClickInteractions();

    /*this.playgroundService.pointsInEnemies.value$.subscribe(() => {
      this.nextLevel();
    });*/
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
    this.playgroundService.enemies.forEach(e => {
      e.render(this.ctx);
    });
    this.ballsService.balls$.value.forEach(b => {
      b.render(this.ctx);
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

  /*private nextLevel(): void {
    this.placeEnemies();
  }*/

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
    this.canvas.nativeElement.addEventListener('click', (e: MouseEvent) => {
      const mousePos = {
        x: e.clientX - this.rect.left,
        y: e.clientY - this.rect.top
      };
      const clickedEnemy = this.playgroundService.enemies.find(enemy => enemy.contains(mousePos));
      if (clickedEnemy) {
        this.playgroundService.addScore(Math.min(this.ballsService.getBallType(BALL_TYPE.Click).damage.value$.value, clickedEnemy.points));
        clickedEnemy.getDamage(this.ballsService.getBallType(BALL_TYPE.Click).damage.value$.value);
      }
    });
  }
}
