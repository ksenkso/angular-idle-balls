import UpgradeStrategy from './UpgradeStrategy';
import Ball from './Ball';

export type BallTypeInfo = {
  damage?: number,
  cost?: number,
  name: string,
  level?: number,
  fill?: string,
  bought?: boolean,
  type: string
};


export type BallTypes = {
  [key in string]: BallType
};

export default class BallType {

  static ballInfo: BallTypeInfo[] = [{
    type: 'click',
    damage: 1,
    cost: 1,
    name: 'Тап',
    bought: true,
  }, {
    damage: 1,
    cost: 1,
    fill: '#fff',
    type: '1',
    name: 'Мяч',
  }, {
    damage: 30,
    cost: 300,
    fill: '#fff',
    type: '30',
    name: 'Теннисный мяч',
  }, {
    damage: 90,
    cost: 900,
    fill: '#fff',
    type: '90',
    name: 'Баскетбольный мяч',
  }, {
    damage: 270,
    cost: 2700,
    fill: '#fff',
    type: '270',
    name: 'Футбольный мяч',
  }, {
    damage: 810,
    cost: 8100,
    fill: '#fff',
    type: '810',
    name: 'Бейсбольный мяч',
  }, {
    damage: 2430,
    cost: 24300,
    fill: '#fff',
    type: '2430',
    name: 'Звёздный мяч',
  }, {
    damage: 7290,
    cost: 72900,
    fill: '#fff',
    type: '7290',
    name: 'Апельсин',
  }, {
    damage: 21800,
    cost: 218700,
    fill: '#fff',
    type: '21800',
    name: 'Арбуз',
  }, {
    damage: 65600,
    cost: 656100,
    fill: '#fff',
    type: '65600',
    name: 'Яйцо',
  }, {
    damage: 196000,
    cost: 1968300,
    fill: '#fff',
    type: '196000',
    name: 'Печенье',
  }, {
    damage: 590000,
    cost: 5904900,
    fill: '#fff',
    type: '590000',
    name: 'Пончик',
  }, {
    damage: 1770000,
    cost: 17714700,
    fill: '#fff',
    type: '1770000',
    name: 'Бургер',
  }, {
    damage: 5310000,
    cost: 53144100,
    fill: '#fff',
    type: '5310000',
    name: 'Маки',
  }, {
    damage: 15900000,
    cost: 159432300,
    fill: '#fff',
    type: '15900000',
    name: 'Пластинка',
  }, {
    damage: 47800000,
    cost: 478296900,
    fill: '#fff',
    type: '47800000',
    name: 'Монета',
  }, {
    damage: 143000000,
    cost: 1434890700,
    fill: '#fff',
    type: '143000000',
    name: 'Глаз',
  }, {
    damage: 430000000,
    cost: 4304672100,
    fill: '#fff',
    type: '430000000',
    name: 'Колесо',
  }, {
    damage: 1290000000,
    cost: 12914016300,
    fill: '#fff',
    type: '1290000000',
    name: 'Пэкмен',
  }, {
    damage: 3870000000,
    cost: 38742048900,
    fill: '#fff',
    type: '3870000000',
    name: 'Мина',
  }, {
    damage: 11600000000,
    cost: 116226146700,
    fill: '#fff',
    type: '11600000000',
    name: 'Радиация',
  }, {
    damage: 34800000000,
    cost: 348678440100,
    fill: '#fff',
    type: '34800000000',
    name: 'Луна',
  }, {
    damage: 104000000000,
    cost: 1046035320300,
    fill: '#fff',
    type: '104000000000',
    name: 'Земля',
  }, {
    damage: 313000000000,
    cost: 3138105960900,
    fill: '#fff',
    type: '313000000000',
    name: 'Нептун',
  }, {
    damage: 941000000000,
    cost: 9414317882700,
    fill: '#fff',
    type: '941000000000',
    name: 'Юпитер',
  }, {
    damage: 2810000000000,
    cost: 28242953648100,
    fill: '#fff',
    type: '281000000000',
    name: 'Атом',
  }];

  public readonly damage: UpgradeStrategy;
  public readonly cost: UpgradeStrategy;
  public readonly type: string;
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

  static defaults(type: string): BallTypeInfo {
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
