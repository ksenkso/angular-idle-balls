import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  public isPaused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public score$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public message$: Subject<string> = new Subject<string>();

  run(): void {
    this.isPaused$.next(false);
  }

  pause(): void {
    this.isPaused$.next(true);
  }

  addScore(amount: number): void {
    this.score$.next(this.score$.value + amount);
  }

  endLevel(): void {
    this.isPaused$.next(true);
    this.message$.next('Level cleared!');
  }
}
