import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import Ball from './Ball';
import Vector from './Vector';
import BallType, {BALL_TYPES, BallTypes} from './BallType';



@Injectable({
  providedIn: 'root'
})
export class BallsService {
  public balls$: BehaviorSubject<Ball[]> = new BehaviorSubject<Ball[]>([]);
  public ballTypes: BallTypes = {
    [BALL_TYPES.Basic]: new BallType(BALL_TYPES.Basic),
    [BALL_TYPES.Blue]: new BallType(BALL_TYPES.Blue),
    [BALL_TYPES.Green]: new BallType(BALL_TYPES.Green),
    [BALL_TYPES.Brown]: new BallType(BALL_TYPES.Brown),
  };

  constructor() {
  }

  addBall(): void {
    const ball = new Ball(new Vector(0, 0));
    this.balls$.next(this.balls$.value.concat(ball));
  }
}
