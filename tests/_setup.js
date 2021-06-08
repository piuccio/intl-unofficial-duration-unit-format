require('intl-pluralrules');
// NumberFormat polyfill needed on node 10
require('@formatjs/intl-numberformat/polyfill');
if (typeof Intl.NumberFormat.__addLocaleData === 'function') {
  require('@formatjs/intl-numberformat/locale-data/en.js');
  require('@formatjs/intl-numberformat/locale-data/ja.js');
}
