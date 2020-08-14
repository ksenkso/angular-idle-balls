import UpgradeStrategy from './UpgradeStrategy';
import Ball from './Ball';

export enum BALL_TYPE {
  Click = 'Click',
  Basic = 'Basic',
  Blue = 'Blue',
  Green = 'Green',
  Brown = 'Brown'
}

export type BallTypeInfo = {
  damage?: number,
  cost?: number,
  name: string,
  level?: number,
  fill?: string,
  bought?: boolean,
  type: BALL_TYPE
};
export type BallInfo = {
  [key in BALL_TYPE]: BallTypeInfo
};


export type BallTypes = {
  [key in BALL_TYPE]: BallType
};

export default class BallType {

  static ballInfo: BallTypeInfo[] = [
    {
      type: BALL_TYPE.Click,
      damage: 1,
      cost: 1,
      name: 'Click',
      bought: true
    },
    {
      type: BALL_TYPE.Basic,
      damage: 10,
      cost: 10,
      name: 'Basic',
      fill: '#000000',
    },
    {
      type: BALL_TYPE.Blue,
      damage: 50,
      cost: 100,
      name: 'Blue',
      fill: '#0b4b8f',
    },
    {
      type: BALL_TYPE.Green,
      damage: 100,
      cost: 1000,
      name: 'Green',
      fill: '#419224',
    },
    {
      type: BALL_TYPE.Brown,
      damage: 250,
      cost: 8000,
      name: 'Brown',
      fill: '#4a2009',
    },
  ];

  public readonly damage: UpgradeStrategy;
  public readonly cost: UpgradeStrategy;
  public readonly type: BALL_TYPE;
  public readonly name: string;
  public bought = false;

  constructor(config: BallTypeInfo) {
    const defaults = BallType.defaults(config.type);
    this.type = config.type;
    this.damage = new UpgradeStrategy({value: config.damage, base: defaults.damage, factor: 1.1, level: config.level});
    this.cost = new UpgradeStrategy(({value: config.cost, base: defaults.cost, factor: 1.15, level: config.level}));
    this.name = config.name;
    this.bought = config.bought;
  }

  static defaults(type: BALL_TYPE): BallTypeInfo {
    return BallType.ballInfo.find(ballType => ballType.type === type);
  }

  upgrade(): void {
    this.damage.upgrade();
    this.cost.upgrade();
  }

  setLevel(level: number): void {
    this.damage.level = level;
    this.cost.level = level;
  }

  create(ctx: CanvasRenderingContext2D): Ball {
    const info = BallType.defaults(this.type);
    const ball = new Ball({ctx, pos: {x: 0, y: 0}, damage: info.damage, fill: info.fill});
    this.damage.value$.subscribe(damage => ball.damage = damage);
    return ball;
  }

  config(config: BallTypeInfo): void {
    this.damage.upgrade(config.level);
  }

  serialize(): BallTypeInfo {
    return {
      bought: this.bought,
      cost: this.cost.value$.value,
      damage: this.damage.value$.value,
      name: this.name,
      level: this.cost.level,
      type: this.type
    };
  }
}
