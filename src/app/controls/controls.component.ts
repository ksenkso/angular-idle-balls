import {Component} from '@angular/core';
import {PlaygroundService} from '../playground.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent {
  isPaused = true;
  score = 0;
  level: number;
  progress: number;
  constructor(
    private playgroundService: PlaygroundService,
  ) {
    this.playgroundService.isPaused$.subscribe(isPaused => this.isPaused = isPaused);
    this.playgroundService.score$.subscribe(score => this.score = score);
    this.playgroundService.pointsInEnemies.value$.subscribe(() => this.level = this.playgroundService.pointsInEnemies.level);
    this.playgroundService.levelProgress$.subscribe(levelProgress => this.progress = levelProgress);
  }

  run(): void {
    this.playgroundService.run();
  }

  pause(): void {
    this.playgroundService.pause();
  }

}
