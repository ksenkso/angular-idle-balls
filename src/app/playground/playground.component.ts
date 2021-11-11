import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js';
import {IEnemyData} from './IEnemy';
import {Enemy} from './Enemy';
import {Ball, IBallType} from '../OldBall';
import Vector from '../Vector';
import {randomPoint} from '../utils';
import {RectSize} from './RectSize';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements AfterViewInit {
  private _stage: PIXI.Container;
  private _app: PIXI.Application;
  private _ballsData: IBallType[] = [
    {
      damage: 10,
      spriteUrl: '/assets/balls/football.png'
    }
  ];
  private _enemiesData: IEnemyData[] = Array(20).fill(0).map((_, i) => {
    return {
      position: { x: 50 + 80 * (i % 4), y: 100 + 80 * (i % 5)},
      points: 100,
      totalPoints: 100,
    };
  });
  private _enemies: Enemy[] = [];
  private _balls: Ball[] = [];
  private _pointer: Ball = new Ball({
    spriteUrl: '/assets/balls/click.png',
    damage: 10,
  })
  public isPaused = false;

  @Input() private width: number;
  @Input() private height: number;
  @ViewChild('canvasContainer') canvasContainer: ElementRef<HTMLElement>;
  private _sizes: RectSize;

  ngAfterViewInit(): void {
    this._app = new PIXI.Application({
      width: this.width,
      height: this.height,
      antialias: true,
    });
    console.log(this._enemiesData);
    this._sizes = { width: this.width, height: this.height };
    this.canvasContainer.nativeElement.appendChild(this._app.view);
    this._stage = this._app.stage;
    this._ballsData.forEach((ballType) => {
      const ball = new Ball(ballType);
      this._placeBall(ball);
      console.log(ball);
      this._balls.push(ball);
      this._stage.addChild(ball);
    });
    this._enemiesData.forEach((enemyData) => {
      const enemy = new Enemy(enemyData);
      enemy.on('pointerdown', () => {
        enemy.takeDamage(this._pointer);
      });
      this._enemies.push(enemy);
      this._stage.addChild(enemy);
      this._stage.addChild(enemy);
    });
    this._app.ticker.add(() => {
      this._balls.forEach(ball => {
        ball.stepInCurrentDirection();
        const collidingEnemy = this._enemies.find(enemy => ball.collidesCircle(enemy));
        if (collidingEnemy) {
          collidingEnemy.takeDamage(ball);
          ball.reboundFromEnemy(collidingEnemy.getDimensions());
        } else {
          ball.collidePlayground(this._sizes);
        }
      });
    });
  }

  private _placeBall(ball: Ball) {
    ball.setPosition(randomPoint(this.width, this.height));
    ball.setVelocity(Vector.scale(Vector.randomNormalized(), 3));
  }
}
