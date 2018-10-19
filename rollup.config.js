import flow from 'rollup-plugin-flow';
import flowEntry from 'rollup-plugin-flow-entry';
import filesize from 'rollup-plugin-filesize';
import minify from 'rollup-plugin-babel-minify';
import buble from 'rollup-plugin-buble';
import pkg from './package.json';

export default {
  input: 'index.js',
  plugins: [
    flow(),
    flowEntry(),
    buble(),
    filesize({ showMinifiedSize: false }),
    minify({ comments: false, sourceMap: true }),
  ],
  external: Object.keys(pkg.peerDependencies),
  output: [{
    file: 'dist/es5/bundle.cjs.min.js',
    format: 'cjs',
  }, {
    file: 'dist/es5/bundle.iife.min.js',
    format: 'iife',
    name: 'DurationUnitFormat',
    globals: {
      'intl-messageformat': 'IntlMessageFormat',
    },
  }],
};
