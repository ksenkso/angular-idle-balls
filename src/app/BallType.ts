import UpgradeStrategy from './UpgradeStrategy';
export enum BALL_TYPES {
  Basic,
  Blue,
  Green,
  Brown
}

export const ballInfo = {
  [BALL_TYPES.Basic]: {
    damage: 10,
    cost: 0
  },
  [BALL_TYPES.Blue]: {
    damage: 50,
    cost: 100
  },
  [BALL_TYPES.Green]: {
    damage: 100,
    cost: 1000
  },
  [BALL_TYPES.Brown]: {
    damage: 250,
    cost: 8000
  },
};

export type BallTypes = {
  [key in BALL_TYPES]: BallType
};

export default class BallType {
  public readonly damage: UpgradeStrategy;
  public readonly cost: UpgradeStrategy;
  public readonly type: BALL_TYPES;

  constructor(type: BALL_TYPES) {
    this.type = type;
    const info = ballInfo[this.type];
    this.damage = new UpgradeStrategy(info.damage);
    this.cost = new UpgradeStrategy(info.cost, 1.15);
  }

  upgrade(): void {
    this.damage.upgrade();
    this.cost.upgrade();
  }
}
