import UpgradeStrategy from './UpgradeStrategy';
import Ball from './Ball';

export type BallTypeInfo = {
  damage?: number,
  image?: string,
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

  static ballInfo: BallTypeInfo[] = [
    {
    type: 'click',
    damage: 1,
    cost: 1,
    name: 'Клик',
    bought: true,
    image: 'assets/balls/click.png',
  }, {
    damage: 1,
    cost: 1,
    fill: '#fff',
    type: 'ball',
    name: 'Мяч',
    image: 'assets/balls/ball.png'
  }, {
    damage: 30,
    cost: 300,
    fill: '#fff',
    type: 'tennis',
    name: 'Теннисный мяч',
    image: 'assets/balls/tennis.png'
  }, {
    damage: 90,
    cost: 900,
    fill: '#fff',
    type: 'basketball',
    name: 'Баскетбольный мяч',
    image: 'assets/balls/basketball.png'
  }, {
    damage: 270,
    cost: 2700,
    fill: '#fff',
    type: 'football',
    name: 'Футбольный мяч',
    image: 'assets/balls/football.png'
  }, {
    damage: 810,
    cost: 8100,
    fill: '#fff',
    type: 'baseball',
    name: 'Бейсбольный мяч',
    image: 'assets/balls/baseball.png'
  }, {
    damage: 2430,
    cost: 24300,
    fill: '#fff',
    type: 'star',
    name: 'Звёздный мяч',
    image: 'assets/balls/star.png'
  }, {
    damage: 7290,
    cost: 72900,
    fill: '#fff',
    type: 'orange',
    name: 'Апельсин',
    image: 'assets/balls/orange.png'
  }, {
    damage: 21800,
    cost: 218700,
    fill: '#fff',
    type: 'watermelon',
    name: 'Арбуз',
    image: 'assets/balls/watermelon.png'
  }, {
    damage: 65600,
    cost: 656100,
    fill: '#fff',
    type: 'egg',
    name: 'Яйцо',
    image: 'assets/balls/egg.png'
  }, {
    damage: 196000,
    cost: 1968300,
    fill: '#fff',
    type: 'cookie',
    name: 'Печенье',
    image: 'assets/balls/cookie.png'
  }, {
    damage: 590000,
    cost: 5904900,
    fill: '#fff',
    type: 'donut',
    name: 'Пончик',
    image: 'assets/balls/donut.png'
  }, {
    damage: 1770000,
    cost: 17714700,
    fill: '#fff',
    type: 'burger',
    name: 'Бургер',
    image: 'assets/balls/burger.png'
  }, {
    damage: 5310000,
    cost: 53144100,
    fill: '#fff',
    type: 'maki',
    name: 'Маки',
    image: 'assets/balls/maki.png'
  }, {
    damage: 15900000,
    cost: 159432300,
    fill: '#fff',
    type: 'vinyl',
    name: 'Пластинка',
    image: 'assets/balls/vinyl.png'
  }, {
    damage: 47800000,
    cost: 478296900,
    fill: '#fff',
    type: 'coin',
    name: 'Монета',
    image: 'assets/balls/coin.png'
  }, {
    damage: 143000000,
    cost: 1434890700,
    fill: '#fff',
    type: 'eye',
    name: 'Глаз',
    image: 'assets/balls/eye.png'
  }, {
    damage: 430000000,
    cost: 4304672100,
    fill: '#fff',
    type: 'wheel',
    name: 'Колесо',
    image: 'assets/balls/wheel.png'
  }, {
    damage: 1290000000,
    cost: 12914016300,
    fill: '#fff',
    type: 'pacman',
    name: 'Пэкмен',
    image: 'assets/balls/pacman.png'
  }, {
    damage: 3870000000,
    cost: 38742048900,
    fill: '#fff',
    type: 'mine',
    name: 'Мина',
    image: 'assets/balls/mine.png'
  }, {
    damage: 11600000000,
    cost: 116226146700,
    fill: '#fff',
    type: 'radiation',
    name: 'Радиация',
    image: 'assets/balls/radiation.png'
  }, {
    damage: 34800000000,
    cost: 348678440100,
    type: 'moon',
    name: 'Луна',
    image: 'assets/balls/moon.png',
    fill: '#fff'
  }, {
    damage: 104000000000,
    cost: 1046035320300,
    fill: '#fff',
    type: 'earth',
    name: 'Земля',
    image: 'assets/balls/earth.png'
  }, {
    damage: 313000000000,
    cost: 3138105960900,
    fill: '#fff',
    type: 'saturn',
    name: 'Сатурн',
    image: 'assets/balls/saturn.png'
  }, {
    damage: 941000000000,
    cost: 9414317882700,
    fill: '#fff',
    type: 'jupiter',
    name: 'Юпитер',
    image: 'assets/balls/jupiter.png'
  }, {
    damage: 2810000000000,
    cost: 28242953648100,
    fill: '#fff',
    type: 'atom',
    name: 'Атом',
    image: 'assets/balls/atom.png'
  }];

  public readonly damage: UpgradeStrategy;
  public readonly cost: UpgradeStrategy;
  public readonly type: string;
  public readonly name: string;
  public bought = false;
  public image: string;

  constructor(config: BallTypeInfo) {
    const defaults = BallType.defaults(config.type);
    this.image = defaults.image;
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
    const image = new Image();
    image.src = info.image;
    const ball = new Ball({ctx, pos: {x: 0, y: 0}, damage: info.damage, fill: info.fill, image});
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
