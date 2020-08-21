import {TestBed} from '@angular/core/testing';
import {BallsService} from './balls.service';
import {mockAddEventListener, mockLocalStorage} from '../../tests/mocks';
import {PlaygroundService} from './playground.service';
import BallType from './BallType';

describe('BallsService', () => {
  let service: BallsService;
  let events;
  const playgroundService: PlaygroundService = new PlaygroundService();
  beforeEach(() => {
    TestBed.configureTestingModule({});
    mockLocalStorage();
    events = mockAddEventListener();
    service = new BallsService(playgroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init with default ball values when there is no data saved', () => {
    localStorage.clear();
    events.beforeunload = [];
    service = new BallsService(playgroundService);
    expect(localStorage.getItem((service as any).key)).not.toBeDefined();
    expect(service.ballTypes).toEqual(BallType.ballInfo.map(info => new BallType(info)));
  });

  it('should init with data from storage when it is available', () => {
    const info = BallType.ballInfo.map(type => new BallType(type));
    info[1].bought = true;
    localStorage.clear();
    localStorage.setItem((service as any).key, JSON.stringify(info));
    service = new BallsService(playgroundService);
    expect(service.ballTypes[1].bought).toBeTrue();
  });

  it('should have empty array of balls by default', () => {
    expect(service.balls$.value).toEqual([]);
  });

  it('should return correct BallType object', () => {
    BallType.ballInfo.forEach(info => {
      expect(service.getBallType(info.type).type).toEqual(info.type);
    });
    expect(service.getBallType('non-existing-type')).not.toBeDefined();
  });

  it('should add ball to the playground', () => {
    expect(service.balls$.value.length).toEqual(0);
    service.addBall('ball');
    service.balls$.subscribe(balls => expect(balls.length).toEqual(1));
  });

  it('should not add a ball when there is not enough points', () => {
    expect(playgroundService.score$.value).toEqual(0);
    service.buy('ball');
    expect(service.balls$.value.length).toEqual(0);
  });

  it('should add a ball when there is enough points', () => {
    playgroundService.score$.next(1);
    service.buy('ball');
    expect(service.balls$.value.length).toEqual(1);
  });

  it('should not add a ball if it is already bought', () => {
    playgroundService.score$.next(1);
    service.buy('ball');
    expect(service.balls$.value.length).toEqual(1);
    service.buy('ball');
    expect(service.balls$.value.length).toEqual(1);
  });

  it('should upgrade a ball if there is enough points', () => {
    playgroundService.score$.next(2);
    service.buy('ball');
    expect(service.upgrade('ball')).toBeTrue();
    const type = service.getBallType('ball');
    expect(type.damage.level).toEqual(2);
  });

  it('should not upgrade a ball if there is not enough points', () => {
    playgroundService.score$.next(1);
    service.buy('ball');
    expect(service.upgrade('ball')).toBeFalse();
    const type = service.getBallType('ball');
    expect(type.damage.level).toEqual(1);
  });


});
