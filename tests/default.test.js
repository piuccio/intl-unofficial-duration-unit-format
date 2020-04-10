import DurationUnitFormat from '../index';

describe('formatToParts', () => {
  it('formats to parts with default format of only seconds', () => {
    const parts = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en'));

    expect(parts(0)).toEqual([
      { type: 'second', value: '0' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(parts(1)).toEqual([
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'second' },
    ]);
    expect(parts(30)).toEqual([
      { type: 'second', value: '30' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(parts(59)).toEqual([
      { type: 'second', value: '59' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(parts(60)).toEqual([
      { type: 'second', value: '60' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(parts(61)).toEqual([
      { type: 'second', value: '61' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(parts(120)).toEqual([
      { type: 'second', value: '120' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
  });
});
