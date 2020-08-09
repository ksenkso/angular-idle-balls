import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import Ball from './Ball';
import BallType, {BALL_TYPE} from './BallType';
import {PlaygroundService} from './playground.service';


@Injectable({
  providedIn: 'root'
})
export class BallsService {
  public balls$: BehaviorSubject<Ball[]> = new BehaviorSubject<Ball[]>([]);
  public ballTypes: {[key in BALL_TYPE]: BallType} = {
    [BALL_TYPE.Click]: new BallType(BALL_TYPE.Click),
    [BALL_TYPE.Basic]: new BallType(BALL_TYPE.Basic),
    [BALL_TYPE.Blue]: new BallType(BALL_TYPE.Blue),
    [BALL_TYPE.Green]: new BallType(BALL_TYPE.Green),
    [BALL_TYPE.Brown]: new BallType(BALL_TYPE.Brown),
  };

  constructor(
    private playgroundService: PlaygroundService,
  ) {
  }

  addBall(type: BALL_TYPE): void {
    const ball = this.ballTypes[type].create();
    this.balls$.next(this.balls$.value.concat(ball));
  }

  buy(type: BALL_TYPE): void {
    const ballToBuy = this.ballTypes[type];
    if (ballToBuy && !ballToBuy.bought) {
      const newScore = this.playgroundService.score$.value - ballToBuy.cost.value$.value;
      if (newScore >= 0) {
        ballToBuy.bought = true;
        this.playgroundService.score$.next(newScore);
        this.addBall(type);
      }
    }
  }

  upgrade(type: BALL_TYPE): void {
    const ballToUpgrade = this.ballTypes[type];
    const newScore = this.playgroundService.score$.value - ballToUpgrade.cost.value$.value;
    if (newScore >= 0) {
      ballToUpgrade.upgrade();
      this.playgroundService.score$.next(newScore);
    }
  }
}
