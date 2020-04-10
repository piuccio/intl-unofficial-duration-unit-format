import IntlMessageFormat from 'intl-messageformat';
import trim from './lib/trim';

function DurationUnitFormat(locales, options = defaultOptions) {
  this.locales = locales;
  // TODO I'm ignoring the unit for now, value is always expressed in seconds
  this.unit = 'second';
  // .style determines how the placeholders are converted to plain text
  this.style = options.style || DurationUnitFormat.styles.LONG;
  // .isTimer determines some special behaviour, we want to keep the 0s
  this.isTimer = this.style === DurationUnitFormat.styles.TIMER;
  // .format used `seconds`, `minutes`, `hours`, ... as placeholders
  this.format = options.format || (this.isTimer ? '{minutes}:{seconds}' : '{seconds}');
  // How to format unit according to style
  this.formatUnits = (options || defaultOptions).formatUnits || defaultOptions.formatUnits;
  // .formatDuration determines whether we use a space or not
  this.formatDuration = getFormatDuration(options, this.style);
  this.shouldRound = options.round === true;
}

DurationUnitFormat.units = {
  DAY: 'day',
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
};

DurationUnitFormat.styles = {
  CUSTOM: 'custom',
  TIMER: 'timer',
  // http://www.unicode.org/cldr/charts/27/summary/pl.html#5556
  LONG: 'long',
  SHORT: 'short',
  NARROW: 'narrow',
};

DurationUnitFormat.prototype.formatToParts = function (value) {
  // Extract all the parts that are actually used from the localised format
  const parts = new IntlMessageFormat(this.format, this.locales).formatToParts({
    second: { unit: DurationUnitFormat.units.SECOND },
    seconds: { unit: DurationUnitFormat.units.SECOND },
    minute: { unit: DurationUnitFormat.units.MINUTE },
    minutes: { unit: DurationUnitFormat.units.MINUTE },
    hour: { unit: DurationUnitFormat.units.HOUR },
    hours: { unit: DurationUnitFormat.units.HOUR },
    day: { unit: DurationUnitFormat.units.DAY },
    days: { unit: DurationUnitFormat.units.DAY },
  });
  // Compute the value of each bucket depending on which parts are used
  const buckets = splitSecondsInBuckets(value, this.unit, parts, this.shouldRound);
  // Each part from the format message could potentially contain multiple parts
  const result = parts.reduce((all, token) => all.concat(this._formatToken(token, buckets)), []);
  return this._trimOutput(result, parts);
};

DurationUnitFormat.prototype._formatToken = function(token, buckets) {
  const {value} = token;
  if (value.unit) {
    const number = buckets[value.unit];
    return (number || this.isTimer) ? this._formatDurationToParts(value.unit, number) : [];
  } else if (value) {
    // If there is no .unit it's text, but it could be an empty string
    return[{ type: 'literal', value }];
  }
  return [];
}

DurationUnitFormat.prototype._formatDurationToParts = function(unit, number) {
  return this.formatDuration.split(SPLIT_POINTS).map((text) => {
    if (text === '{value}') {
      return { type: unit, value: this._formatValue(number) };
    }
    if (this.isTimer) {
      // With timer style, we only show the value
      return;
    }
    if (text === '{unit}') {
      const unitWithStyle = isSpecialStyle(this.style) ? `${unit}-${this.style}` : unit;
      const message = this.formatUnits[unitWithStyle] || '{value}';
      const formattedUnit = new IntlMessageFormat(message, this.locales).format({ value: number });
      return { type: 'unit', value: formattedUnit };
    }
    if (text) {
      return { type: 'literal', value: text };
    }
  }).filter(Boolean);
}

DurationUnitFormat.prototype._formatValue = function (number) {
  return this.isTimer ? number.toString().padStart(2, '0') : number.toString();
};

DurationUnitFormat.prototype._trimOutput = function (result, parts) {
  const trimmed = trim(result, this.isTimer);
  if (trimmed.length === 0) {
    // if everything cancels out, return 0 on the lowest available unit
    const minUnit = [
      DurationUnitFormat.units.SECOND,
      DurationUnitFormat.units.MINUTE,
      DurationUnitFormat.units.HOUR,
      DurationUnitFormat.units.DAY,
    ].find((unit) => has(parts, unit));
    return this._formatDurationToParts(minUnit, 0);
  }
  return trimmed;
};

const defaultOptions = {
  // unit: DurationUnitFormat.units.SECOND,
  formatDuration: '{value} {unit}',
  formatDuration_long: '{value} {unit}',
  formatDuration_short: '{value} {unit}',
  formatDuration_narrow: '{value}{unit}',
  formatUnits: {
    // custom values
    [DurationUnitFormat.units.DAY]: '{value, plural, one {day} other {days}}',
    [DurationUnitFormat.units.HOUR]: '{value, plural, one {hour} other {hours}}',
    [DurationUnitFormat.units.MINUTE]: '{value, plural, one {minute} other {minutes}}',
    [DurationUnitFormat.units.SECOND]: '{value, plural, one {second} other {seconds}}',
    // long
    [`${DurationUnitFormat.units.DAY}-long`]: '{value, plural, one {day} other {days}}',
    [`${DurationUnitFormat.units.HOUR}-long`]: '{value, plural, one {hour} other {hours}}',
    [`${DurationUnitFormat.units.MINUTE}-long`]: '{value, plural, one {minute} other {minutes}}',
    [`${DurationUnitFormat.units.SECOND}-long`]: '{value, plural, one {second} other {seconds}}',
    // short
    [`${DurationUnitFormat.units.DAY}-short`]: '{value, plural, one {day} other {days}}',
    [`${DurationUnitFormat.units.HOUR}-short`]: 'hr',
    [`${DurationUnitFormat.units.MINUTE}-short`]: 'min',
    [`${DurationUnitFormat.units.SECOND}-short`]: 'sec',
    // narrow
    [`${DurationUnitFormat.units.DAY}-narrow`]: 'd',
    [`${DurationUnitFormat.units.HOUR}-narrow`]: 'h',
    [`${DurationUnitFormat.units.MINUTE}-narrow`]: 'm',
    [`${DurationUnitFormat.units.SECOND}-narrow`]: 's',
  },
  round: false,
  style: DurationUnitFormat.styles.CUSTOM,
};

const SPLIT_POINTS = /(\{value\}|\{unit\})/;

const SECONDS_IN = {
  day: 24 * 60 * 60,
  hour: 60 * 60,
  minute: 60,
  second: 1,
};

function has(parts, unit) {
  return !!parts.find((_) => _.value.unit === unit);
}

function splitSecondsInBuckets(value, valueUnit, parts, shouldRound) {
  let seconds = value * SECONDS_IN[valueUnit];
  // Rounding will only affect the lowest unit
  // check how many seconds we need to add
  if (shouldRound) {
    const lowestUnit = [
      DurationUnitFormat.units.SECOND,
      DurationUnitFormat.units.MINUTE,
      DurationUnitFormat.units.HOUR,
      DurationUnitFormat.units.DAY,
    ].find((unit) => has(parts, unit));
    // These many seconds will be ignored by the lowest unit
    const remainder = seconds % SECONDS_IN[lowestUnit];
    if (2 * remainder >= SECONDS_IN[lowestUnit]) {
      // The remainder is large, add enough seconds to increse the lowest unit
      seconds += SECONDS_IN[lowestUnit] - remainder;
    }
  }
  const buckets = {};
  [
    DurationUnitFormat.units.DAY,
    DurationUnitFormat.units.HOUR,
    DurationUnitFormat.units.MINUTE,
    DurationUnitFormat.units.SECOND,
  ].forEach((unit) => {
    if (has(parts, unit)) {
      buckets[unit] = Math.floor(seconds / SECONDS_IN[unit]);
      seconds -= buckets[unit] * SECONDS_IN[unit];
    }
  });
  return buckets;
}

function isSpecialStyle(style) {
  return [
    DurationUnitFormat.styles.LONG,
    DurationUnitFormat.styles.SHORT,
    DurationUnitFormat.styles.NARROW,
  ].includes(style);
}

function getFormatDuration(options, style) {
  const key = isSpecialStyle(style)
    ? `formatDuration_${style}`
    : 'formatDuration';
  return options[key] || defaultOptions[key] || defaultOptions.formatDuration;
}

export default DurationUnitFormat;
