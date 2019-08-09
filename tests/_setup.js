require('intl-pluralrules');

const {default: areIntlLocalesSupported} = require('intl-locales-supported');
const localesMyAppSupports = [
  'en',
];

// Determine if the built-in `Intl` has the locale data we need.
if (!areIntlLocalesSupported(localesMyAppSupports)) {
  // `Intl` exists, but it doesn't have the data we need, so load the
  // polyfill and replace the constructors we need with the polyfill's.
  require('@formatjs/intl-relativetimeformat/polyfill');
}
