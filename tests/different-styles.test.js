import DurationUnitFormat from '../index';

describe('formatToParts', () => {
  it('formats to parts with default format of only seconds', () => {
    const long = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', { style: DurationUnitFormat.styles.LONG, format: '{minutes} {seconds}' }));
    const short = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', { style: DurationUnitFormat.styles.SHORT, format: '{minutes} {seconds}' }));
    const narrow = DurationUnitFormat.prototype.formatToParts.bind(new DurationUnitFormat('en', { style: DurationUnitFormat.styles.NARROW, format: '{minutes} {seconds}' }));

    expect(long(0)).toEqual([
      { type: 'second', value: '0' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);
    expect(long(1)).toEqual([
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'second' },
    ]);
    expect(long(60)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minute' },
    ]);
    expect(long(150)).toEqual([
      { type: 'minute', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'minutes' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '30' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'seconds' },
    ]);

    expect(short(0)).toEqual([
      { type: 'second', value: '0' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'sec' },
    ]);
    expect(short(1)).toEqual([
      { type: 'second', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'sec' },
    ]);
    expect(short(60)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'min' },
    ]);
    expect(short(150)).toEqual([
      { type: 'minute', value: '2' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'min' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '30' },
      { type: 'literal', value: ' ' },
      { type: 'unit', value: 'sec' },
    ]);

    expect(narrow(0)).toEqual([
      { type: 'second', value: '0' },
      { type: 'unit', value: 's' },
    ]);
    expect(narrow(1)).toEqual([
      { type: 'second', value: '1' },
      { type: 'unit', value: 's' },
    ]);
    expect(narrow(60)).toEqual([
      { type: 'minute', value: '1' },
      { type: 'unit', value: 'm' },
    ]);
    expect(narrow(150)).toEqual([
      { type: 'minute', value: '2' },
      { type: 'unit', value: 'm' },
      { type: 'literal', value: ' ' },
      { type: 'second', value: '30' },
      { type: 'unit', value: 's' },
    ]);
  });
});
