import {TestBed} from '@angular/core/testing';

import {PlaygroundData, PlaygroundService} from './playground.service';
import {mockAddEventListener, mockLocalStorage} from '../../tests/mocks';
import EnemyBall from './EnemyBall';

describe('PlaygroundService', () => {
  let service: PlaygroundService;
  let events;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  beforeEach(() => {
    TestBed.configureTestingModule({});
    mockLocalStorage();
    events = mockAddEventListener();
    service = TestBed.inject(PlaygroundService);
    service.ctx = ctx;
    service.sizes = {
      width: 500,
      height: 800
    };
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should restore data from storage if available', () => {
    const restoreData: PlaygroundData = {
      levelScore: 10,
      levelTotal: 1000,
      enemies: [{pos: {x: 50, y: 50}, initialPoints: 20, points: 10}],
      score: 99999,
      isPaused: true,
      level: 2,
    };
    localStorage.setItem((service as any).key, JSON.stringify(restoreData));
    events.beforeunload = [];
    service = new PlaygroundService();
    expect(service.score$.value)
      .toEqual(restoreData.score, 'score should be restored');
    expect(service.enemies.length)
      .toEqual(restoreData.enemies.length, 'should load only one enemy');
    expect(service.isPaused$.value)
      .toEqual(restoreData.isPaused, 'should be paused');
    expect(service.levelProgress$.value)
      .toEqual(restoreData.levelScore / restoreData.levelTotal, 'should load level progress');
    expect(service.pointsInEnemies.level)
      .toEqual(restoreData.level, 'should load level');
  });

  it('should use default params if storage data is not available', () => {
    const defaultParams: PlaygroundData = {
      score: 0,
      enemies: [],
      isPaused: false,
      levelScore: 0,
      levelTotal: Infinity,
      level: 1,
    };

    expect(service.score$.value)
      .toEqual(defaultParams.score, 'score should be 0');
    expect(service.enemies.length)
      .toEqual(defaultParams.enemies.length, 'should be an empty array');
    expect(service.isPaused$.value)
      .toEqual(defaultParams.isPaused, 'should be running');
    expect(service.levelProgress$.value)
      .toEqual(defaultParams.levelScore / defaultParams.levelTotal, 'should be 0');
    expect(service.pointsInEnemies.level)
      .toEqual(defaultParams.level, 'should load level 1');
  });

  it('should add passed amount of points to score', () => {
    expect(service.score$.value).toEqual(0);
    service.addScore(100);
    expect(service.score$.value).toEqual(100);
  });

  it('should reset level score when #nextLevel is called', () => {
    service.levelProgress$.next(0.99);
    service.nextLevel();
    expect(service.levelProgress$.value).toEqual(0);
  });

  it('should update level progress when score is added', () => {
    service.addScore(10);
    service.setLevelTotal(1000);
    expect(service.levelProgress$.value).toEqual(10 / 1000);
  });

  it('should update level progress through #setLevelTotal', () => {
    expect(service.levelProgress$.value).toEqual(0);
    service.addScore(100);
    service.setLevelTotal(1000);
    expect(service.levelProgress$.value).toEqual(100 / 1000);
  });

  it('should update level total after placing enemies', () => {
    expect((service as any).levelTotal).toEqual(Infinity);
    service.placeEnemies();
    expect((service as any).levelTotal)
      .toEqual(service.pointsInEnemies.value$.value * service.enemies.length);
  });

  it('should update level progress if enemies were placed from scratch', () => {
    service.levelProgress$.next(0.5);
    service.placeEnemies();
    expect(service.levelProgress$.value).toEqual(0);
  });

  it('should not update level progress if enemies were restored from storage', () => {
    const restoredParams: PlaygroundData = {
      score: 0,
      enemies: [{
        pos: {x: 50, y: 50},
        initialPoints: 20,
        points: 10,
      }],
      isPaused: false,
      levelScore: 0,
      levelTotal: Infinity,
      level: 1,
    };
    localStorage.setItem((service as any).key, JSON.stringify(restoredParams));
    service = new PlaygroundService();
    service.ctx = ctx;
    service.sizes = {
      width: 500,
      height: 800,
    };
    service.levelProgress$.next(0.5);
    service.placeEnemies();
    expect(service.levelProgress$.value).toEqual(0.5);
  });

  it('should remove an enemy from #enemies array', () => {
    const enemy = new EnemyBall({
      ctx: service.ctx,
      pos: {x: 50, y: 50},
      points: 10,
      initialPoints: 20,
      onDestroy: service.onEnemyDestroy.bind(service)
    });
    service.enemies.push(enemy);
    service.onEnemyDestroy(enemy);
    expect(service.enemies.length).toEqual(0);
  });

  it('should reset cursor to default when ball is destroyed by mouse', () => {
    const enemy = new EnemyBall({
      ctx: service.ctx,
      pos: {x: 50, y: 50},
      points: 10,
      initialPoints: 20,
      onDestroy: service.onEnemyDestroy.bind(service)
    });
    canvas.style.cursor = 'pointer';
    enemy.isPressed = true;
    service.enemies.push(enemy);
    service.onEnemyDestroy(enemy);
    expect(canvas.style.cursor).toEqual('default');
  });
});
