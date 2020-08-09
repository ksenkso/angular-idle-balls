import {Component} from '@angular/core';
import {PlaygroundService} from '../playground.service';
import {BallsService} from '../balls.service';
import {BALL_TYPE} from '../BallType';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent {
  isPaused = true;
  score = 0;
  level: number;
  constructor(
    private playgroundService: PlaygroundService,
    private ballsService: BallsService,
  ) {
    this.playgroundService.isPaused$.subscribe(isPaused => this.isPaused = isPaused);
    this.playgroundService.score$.subscribe(score => this.score = score);
    this.playgroundService.pointsInEnemies.value$.subscribe(() => this.level = this.playgroundService.pointsInEnemies.level);
  }

  run(): void {
    this.playgroundService.run();
  }

  pause(): void {
    this.playgroundService.pause();
  }

  addBall(): void {
    for (let i = 0; i < 40; i++) {
      this.ballsService.addBall(BALL_TYPE.Basic);
    }
  }

}
