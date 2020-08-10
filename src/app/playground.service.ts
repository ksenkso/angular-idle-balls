import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import UpgradeStrategy from './UpgradeStrategy';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  public isPaused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public score$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public pointsInEnemies: UpgradeStrategy = new UpgradeStrategy(20, 1.2);
  public levelProgress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private levelTotal = Infinity;
  private levelScore = 0;

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
  }

  setLevelTotal(total: number): void {
    this.levelTotal = total;
    this.levelProgress$.next(this.levelScore / this.levelTotal);
  }
}
