import * as PIXI from 'pixi.js';

export interface IEnemyData {
    position: PIXI.IPointData;
    points: number;
    totalPoints: number;
}

export interface IEnemy {
  getPosition(): PIXI.IPointData;
  getPoints(): number;
  getTotalPoints(): number;
}
