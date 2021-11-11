import {IBall} from '../OldBall';

export interface IEnemyView {
    takeDamage(ball: IBall): void;
}
