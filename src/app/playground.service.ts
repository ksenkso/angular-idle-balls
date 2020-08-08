import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import UpgradeStrategy from './UpgradeStrategy';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  public isPaused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public score$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public message$: Subject<string> = new Subject<string>();
  public pointsInEnemies: UpgradeStrategy = new UpgradeStrategy(20, 1.2);

  run(): void {
    this.isPaused$.next(false);
  }

  pause(): void {
    this.isPaused$.next(true);
  }

  addScore(amount: number): void {
    this.score$.next(this.score$.value + amount);
  }

  nextLevel(): void {
    this.message$.next('Level cleared!');
    this.pointsInEnemies.upgrade();
  }
}
