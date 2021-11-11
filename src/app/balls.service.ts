import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import OldBall from './OldBall';
import BallType, {BallTypeInfo} from './BallType';
import {PlaygroundService} from './playground.service';
import {StorageService} from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class BallsService extends StorageService<BallTypeInfo[]> {
  public static shouldNotSave = false;
  public static shouldNotLoad = false;
  public balls$: BehaviorSubject<OldBall[]> = new BehaviorSubject<OldBall[]>([]);
  public ballTypes: BallType[];

  constructor(
    private playgroundService: PlaygroundService,
  ) {
    super('balls');
    this.ballTypes
      .filter(ballType => ballType.bought && ballType.type !== 'click')
      .map(ballType => ballType.create(this.playgroundService.ctx))
      .forEach((ball) => {
        this.balls$.next(this.balls$.value.concat(ball));
      });
  }

  protected init(data?: BallTypeInfo[]): void {
    if (data && data.length) {
      this.ballTypes = data.map(info => new BallType(info));
    } else {
      this.ballTypes = BallType.ballInfo.map(info => new BallType(info));
    }
  }

  store(): BallTypeInfo[] {
    return this.ballTypes.map(ballType => ballType.serialize());
  }

  getBallType(type: string): BallType {
    return this.ballTypes.find(ballType => ballType.type === type);
  }

  addBall(type: string): void {
    const ball = this.getBallType(type).create(this.playgroundService.ctx);
    this.balls$.next(this.balls$.value.concat(ball));
  }

  buy(type: string): void {
    const ballToBuy = this.getBallType(type);
    if (ballToBuy && !ballToBuy.bought) {
      const newScore = this.playgroundService.score$.value - ballToBuy.cost.value$.value;
      if (newScore >= 0) {
        ballToBuy.bought = true;
        this.playgroundService.score$.next(newScore);
        this.addBall(type);
      }
    }
  }

  upgrade(type: string): boolean {
    const ballToUpgrade = this.getBallType(type);
    const newScore = this.playgroundService.score$.value - ballToUpgrade.cost.value$.value;
    if (newScore >= 0) {
      ballToUpgrade.upgrade();
      this.playgroundService.score$.next(newScore);
      return true;
    }
    return false;
  }

}
