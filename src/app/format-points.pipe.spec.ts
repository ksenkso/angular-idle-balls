import {FormatPointsPipe} from './format-points.pipe';

fdescribe('FormatPointsPipe', () => {
  let pipe: FormatPointsPipe;
  beforeEach(() => {
    pipe = new FormatPointsPipe();
  });
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should output plain number for values < 1000', () => {
    expect(pipe.transform(0)).toEqual('0');
    expect(pipe.transform(10)).toEqual('10');
    expect(pipe.transform(100)).toEqual('100');
    expect(pipe.transform(999)).toEqual('999');
  });

  it('should add proper key for each number of digits', () => {
    expect(pipe.transform(1000)).toEqual('1k');
    expect(pipe.transform(100000)).toEqual('100k');
    expect(pipe.transform(10 ** 6)).toEqual('1M');
    expect(pipe.transform(10 ** 9)).toEqual('1G');
    expect(pipe.transform(10 ** 12)).toEqual('1T');
    expect(pipe.transform(10 ** 15)).toEqual('1P');
    expect(pipe.transform(10 ** 18)).toEqual('1E');
  });
  it ('should add `E` if the value is greater than 10^18', () => {
    expect(pipe.transform(10 ** 21 + 1)).toEqual('1000E');
    expect(pipe.transform(10 ** 22)).toEqual('10000E');
    expect(pipe.transform(10 ** 24)).toEqual('1000000E');
  });
});
