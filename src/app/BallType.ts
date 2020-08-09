import UpgradeStrategy from './UpgradeStrategy';
import Ball from './Ball';

export enum BALL_TYPE {
  Basic,
  Blue,
  Green,
  Brown
}

export type BallInfo = {
  [key in BALL_TYPE]: {
    damage: number,
    cost: number,
    name: string,
    fill: string,
  }
};

export const ballInfo: BallInfo = {
  [BALL_TYPE.Basic]: {
    damage: 10,
    cost: 1,
    name: 'Basic',
    fill: '#000000',
  },
  [BALL_TYPE.Blue]: {
    damage: 50,
    cost: 100,
    name: 'Blue',
    fill: '#0b4b8f',
  },
  [BALL_TYPE.Green]: {
    damage: 100,
    cost: 1000,
    name: 'Green',
    fill: '#419224',
  },
  [BALL_TYPE.Brown]: {
    damage: 250,
    cost: 8000,
    name: 'Brown',
    fill: '#4a2009',
  },
};

export type BallTypes = {
  [key in BALL_TYPE]: BallType
};

export default class BallType {
  public readonly damage: UpgradeStrategy;
  public readonly cost: UpgradeStrategy;
  public readonly type: BALL_TYPE;
  public readonly name: string;
  public bought = false;

  constructor(type: BALL_TYPE) {
    this.type = type;
    const info = ballInfo[this.type];
    this.damage = new UpgradeStrategy(info.damage);
    this.cost = new UpgradeStrategy(info.cost, 1.15);
    this.name = info.name;
  }

  upgrade(): void {
    this.damage.upgrade();
    this.cost.upgrade();
  }

  create(): Ball {
    const info = ballInfo[this.type];
    const ball = new Ball({pos: {x: 0, y: 0}, damage: info.damage, fill: info.fill});
    this.damage.value$.subscribe(damage => ball.damage = damage);
    return ball;
  }
}
