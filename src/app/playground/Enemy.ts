import * as PIXI from 'pixi.js';
import {IEnemyView} from './IEnemyView';
import {IEnemyData} from './IEnemy';
import {formatPoints, HSLToNumber} from '../utils';
import {IBall} from '../OldBall';
import {CircleData, ICircle} from '../CircleData';

export class Enemy extends PIXI.Container implements IEnemyView, ICircle {
  public static readonly RADIUS = 20;

  private _circle: PIXI.Graphics;
  private _text: PIXI.Text;
  private _points: number;
  private _color: number;
  private _totalPoints: number;
  private _position: PIXI.Point;

  constructor(enemy: IEnemyData) {
    super();
    this._position = new PIXI.Point(enemy.position.x, enemy.position.y);
    this._totalPoints = enemy.totalPoints;

    this._createCircle();
    this._createText();
    this._setPoints(enemy.points);
  }

  private _createText() {
    this._text = new PIXI.Text('');
    this._text.anchor.set(0.5);
    this._text.style.fill = 0xffffff;
    this._text.style.fontSize = 14;
    this._text.position.set(this._position.x, this._position.y);
    this._drawText();
    this.addChild(this._text);
  }

  private _createCircle() {
    this._circle = new PIXI.Graphics();
    this._drawCircle();
    this._circle.buttonMode = true;
    this._circle.interactive = true;
    this._circle.cursor = 'pointer';
    this._circle.on('pointerdown', () => {
      this.emit('pointerdown', this._points);
    });
    this.addChild(this._circle);
  }

  private _getPointsText(): string {
    return formatPoints(this._points);
  }

  private _drawText() {
    this._text.text = this._getPointsText();
  }

  private _setPoints(points: number) {
    this._points = Math.max(points, 0);
    this._calculateColor();
    this._drawText();
  }

  private _calculateColor() {
    this._color = HSLToNumber((this._totalPoints - this._points) / this._totalPoints * 180, 75, 45);
    this._redraw();
  }

  private _redraw() {
    this._drawCircle();
    this._drawText();
  }

  takeDamage(ball: IBall): void {
    this._setPoints(this._points - ball.getDamage());
  }

  getDimensions(): CircleData {
    return {
      x: this._position.x,
      y: this._position.y,
      radius: Enemy.RADIUS,
    };
  }

  private _drawCircle() {
    this._circle.beginFill(this._color);
    this._circle.drawCircle(this._position.x, this._position.y, Enemy.RADIUS);
    this._circle.endFill();
  }
}
