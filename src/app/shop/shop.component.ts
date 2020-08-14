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
  private upgradeTimeout: number;
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
    this.upgradeTimeout = setTimeout(() => {
      this.upgradeTimeout = null;
      this.upgradeInterval = setInterval(this.upgrade.bind(this, type), 1000 / 6);
    }, 1100 / 6);
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
    clearTimeout(this.upgradeTimeout);
    clearInterval(this.upgradeInterval);
  }
}
