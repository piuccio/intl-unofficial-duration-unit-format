require('intl-pluralrules');
// NumberFormat polyfill needed on node 10
require('@formatjs/intl-numberformat/polyfill');
if (typeof Intl.NumberFormat.__addLocaleData === 'function') {
  Intl.NumberFormat.__addLocaleData(
    require('@formatjs/intl-numberformat/dist/locale-data/en.json'),
  );
  Intl.NumberFormat.__addLocaleData(
    require('@formatjs/intl-numberformat/dist/locale-data/ja.json'),
  );
}
