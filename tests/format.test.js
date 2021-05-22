import DurationUnitFormat from '../index';

describe('format', () => {
  it('formats with default format of only seconds', () => {
    const output = DurationUnitFormat.prototype.format.bind(new DurationUnitFormat('en'));

    expect(output(0)).toEqual('0 seconds');
    expect(output(1)).toEqual('1 second');
    expect(output(30)).toEqual('30 seconds');
    expect(output(59)).toEqual('59 seconds');
    expect(output(60)).toEqual('60 seconds');
    expect(output(61)).toEqual('61 seconds');
    expect(output(120)).toEqual('120 seconds');
  });
});
