import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import UpgradeStrategy from './UpgradeStrategy';
import EnemyBall, {EnemyBallConfig} from './EnemyBall';
import {StorageService} from './storage.service';
import {Point2D} from './Vector';
import {RectSize} from './playground/playground.component';

export type PlaygroundData = {
  levelTotal: number;
  score: number,
  levelScore: number,
  level: number,
  enemies: EnemyBallConfig[],
  isPaused: boolean
};

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService extends StorageService<PlaygroundData> {
  public static enemiesCount = 70;
  public static shouldNotLoad = false;
  public static shouldNotSave = false;
  public enemies: EnemyBall[];
  public isPaused$: BehaviorSubject<boolean>;
  public score$: BehaviorSubject<number>;
  public pointsInEnemies: UpgradeStrategy;
  public levelProgress$: BehaviorSubject<number>;
  public sizes: RectSize;
  public ctx: CanvasRenderingContext2D;
  private levelTotal;
  private levelScore;

  constructor() {
    super('playground');
  }

  store(): PlaygroundData {
    return {
      score: this.score$.value,
      levelScore: this.levelScore,
      level: this.pointsInEnemies.level,
      enemies: this.enemies.map(enemy => enemy.serialize()),
      levelTotal: this.levelTotal,
      isPaused: this.isPaused$.value,
    };
  }

  run(): void {
    this.isPaused$.next(false);
  }

  pause(): void {
    this.isPaused$.next(true);
  }

  addScore(amount: number): void {
    this.score$.next(this.score$.value + amount);
    this.levelScore += amount;
    this.levelProgress$.next(this.levelScore / this.levelTotal);
  }

  nextLevel(): void {
    this.levelScore = 0;
    this.pointsInEnemies.upgrade();
    this.placeEnemies();
  }

  setLevelTotal(total: number): void {
    this.levelTotal = total;
    this.levelProgress$.next(this.levelScore / this.levelTotal);
  }

  onEnemyDestroy(ball: EnemyBall): void {
    const index = this.enemies.findIndex(e => e === ball);
    this.enemies.splice(index, 1);
    if (ball.isPressed) {
      this.ctx.canvas.style.cursor = 'default';
    }
    if (!this.enemies.length) {
      setTimeout(() => {
        this.nextLevel();
      }, 8);
    }
  }

  protected init(data?: PlaygroundData): void {
    if (data) {
      this.levelScore = data.levelScore;
      this.levelTotal = data.levelTotal;
      this.levelProgress$ = new BehaviorSubject<number>(this.levelScore / this.levelTotal);
      this.enemies = data.enemies.map(enemy => new EnemyBall({...enemy, onDestroy: this.onEnemyDestroy.bind(this)}));
      this.score$ = new BehaviorSubject<number>(data.score);
      this.pointsInEnemies = new UpgradeStrategy({factor: 1.2, base: 20, level: data.level});
      this.isPaused$ = new BehaviorSubject<boolean>(data.isPaused);
    } else {
      this.enemies = [];
      this.isPaused$ = new BehaviorSubject<boolean>(false);
      this.score$ = new BehaviorSubject<number>(0);
      this.pointsInEnemies = new UpgradeStrategy({value: 20, factor: 1.2, base: 20, level: 1});
      this.levelProgress$ = new BehaviorSubject<number>(0);
      this.levelTotal = Infinity;
      this.levelScore = 0;
      this.isPaused$ = new BehaviorSubject<boolean>(false);
    }
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

  placeEnemies(): void {
    const total = this.pointsInEnemies.value$.value * PlaygroundService.enemiesCount;
    if (!this.enemies.length) {
      this.setLevelTotal(total);
      for (let i = 0; i < PlaygroundService.enemiesCount; i++) {
        const pos = this.placeBall();
        if (pos) {
          const ball = new EnemyBall({
            ctx: this.ctx,
            pos,
            points: Math.floor(this.pointsInEnemies.value$.value),
            onDestroy: this.onEnemyDestroy.bind(this),
          });
          this.enemies.push(ball);
        } else {
          break;
        }
      }
    } else {
      this.levelTotal = total;
      this.enemies.forEach(enemy => enemy.ctx = this.ctx);
    }
  }
}
