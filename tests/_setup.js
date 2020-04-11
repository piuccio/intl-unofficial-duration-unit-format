require('intl-pluralrules');
// NumberFormat polyfill needed on node 10
require('@formatjs/intl-unified-numberformat/polyfill');
if (typeof Intl.NumberFormat.__addLocaleData === 'function') {
  Intl.NumberFormat.__addLocaleData(
    require('@formatjs/intl-unified-numberformat/dist/locale-data/en.json'),
  );
  Intl.NumberFormat.__addLocaleData(
    require('@formatjs/intl-unified-numberformat/dist/locale-data/ja.json'),
  );
}
