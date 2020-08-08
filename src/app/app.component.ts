import {Component, ViewChild} from '@angular/core';
import {PlaygroundService} from './playground.service';
import {PlaygroundComponent} from './playground/playground.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-idle-balls$';
  isPaused = true;
  score = 0;
  @ViewChild(PlaygroundComponent) playground: PlaygroundComponent;

  constructor(private playgroundService: PlaygroundService) {
    this.playgroundService.message$.subscribe(message => console.log(message));
  }

}
