import {Component} from '@angular/core';
import {BallsService} from '../balls.service';
import BallType from '../BallType';
import {PlaygroundService} from '../playground.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  ballTypes: BallType[] = [];
  private upgradeInterval: number;

  constructor(
    public playgroundService: PlaygroundService,
    public ballsService: BallsService,
  ) {
    this.ballTypes = this.ballsService.ballTypes;
    document.addEventListener('mouseup', this.stopUpgrading.bind(this));
  }

  initiateUpgrading(type: string): void {
    this.upgrade(type);
    this.upgradeInterval = setInterval(this.upgrade.bind(this, type), 100);
  }

  buy(type: string): void {
    this.ballsService.buy(type);
  }

  upgrade(type: string): void {
    if (!this.ballsService.upgrade(type)) {
      this.stopUpgrading();
    }
  }

  stopUpgrading(): void {
    clearInterval(this.upgradeInterval);
  }
}
