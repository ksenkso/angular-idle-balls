import {Component} from '@angular/core';
import {BallsService} from '../balls.service';
import BallType, {BALL_TYPE} from '../BallType';
import {PlaygroundService} from '../playground.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  ballTypes: BallType[] = [];

  constructor(
    public playgroundService: PlaygroundService,
    public ballsService: BallsService,
  ) {
    this.ballTypes = this.ballsService.ballTypes;
  }

  buy(type: BALL_TYPE): void {
    this.ballsService.buy(type);
  }

  upgrade(type: BALL_TYPE): void {
    this.ballsService.upgrade(type);
  }
}
