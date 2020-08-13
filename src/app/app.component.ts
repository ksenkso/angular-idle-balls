import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {PlaygroundComponent} from './playground/playground.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'angular-idle-balls$';
  isPaused = true;
  score = 0;
  @ViewChild(PlaygroundComponent) playground: PlaygroundComponent;


}
