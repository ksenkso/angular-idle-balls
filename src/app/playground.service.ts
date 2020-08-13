import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import UpgradeStrategy from './UpgradeStrategy';
import EnemyBall from './EnemyBall';
import {StorageService} from './storage.service';
import {Point2D} from './Vector';
import {RectSize} from './playground/playground.component';

type PlaygroundData = {
  levelTotal: number;
  score: number,
  levelScore: number,
  level: number,
  enemies: any[],
};

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService extends StorageService<PlaygroundData> {
  public static enemiesCount = 40;
  // public static shouldNotLoad = true;
  // public static shouldNotSave = true;
  public enemies: EnemyBall[];
  public isPaused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public score$: BehaviorSubject<number>;
  public pointsInEnemies: UpgradeStrategy;
  public levelProgress$: BehaviorSubject<number>;
  public sizes: RectSize;
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
    } else {
      this.enemies = [];
      this.isPaused$ = new BehaviorSubject<boolean>(false);
      this.score$ = new BehaviorSubject<number>(0);
      this.pointsInEnemies = new UpgradeStrategy({value: 20, factor: 1.2, base: 20, level: 1});
      this.levelProgress$ = new BehaviorSubject<number>(0);
      this.levelTotal = Infinity;
      this.levelScore = 0;
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
    } else {
      this.levelTotal = total;
    }
    if (!this.enemies.length) {
      for (let i = 0; i < PlaygroundService.enemiesCount; i++) {
        const pos = this.placeBall();
        if (pos) {
          const ball = new EnemyBall({
            pos,
            points: Math.floor(this.pointsInEnemies.value$.value),
            onDestroy: this.onEnemyDestroy.bind(this),
          });
          this.enemies.push(ball);
        } else {
          break;
        }
      }
    }

  }
}
