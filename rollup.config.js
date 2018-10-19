import flow from 'rollup-plugin-flow';
import flowEntry from 'rollup-plugin-flow-entry';
import filesize from 'rollup-plugin-filesize';
import minify from 'rollup-plugin-babel-minify';
import buble from 'rollup-plugin-buble';
import pkg from './package.json';

export default [
  // Non minified version ES5 version
  {
    input: 'index.js',
    plugins: [
      flow(),
      flowEntry(),
      buble(),
    ],
    external: Object.keys(pkg.peerDependencies),
    output: [{
      file: 'dist/es5/bundle.cjs.js',
      format: 'cjs',
    }, {
      file: 'dist/es5/bundle.iife.js',
      format: 'iife',
      name: 'DurationUnitFormat',
      globals: {
        'intl-messageformat': 'IntlMessageFormat',
      },
    }],
  },
  // Minified ES5 verions
  {
    input: 'index.js',
    plugins: [
      flow(),
      flowEntry(),
      buble(),
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
  },
  // Non minified version ES6 version
  {
    input: 'index.js',
    plugins: [
      flow(),
      flowEntry(),
    ],
    external: Object.keys(pkg.peerDependencies),
    output: [{
      file: 'dist/es6/bundle.cjs.js',
      format: 'cjs',
    }, {
      file: 'dist/es6/bundle.iife.js',
      format: 'iife',
      name: 'DurationUnitFormat',
      globals: {
        'intl-messageformat': 'IntlMessageFormat',
      },
    }],
  },
  // Minified ES6 verions
  {
    input: 'index.js',
    plugins: [
      flow(),
      flowEntry(),
      filesize({ showMinifiedSize: false }),
      minify({ comments: false, sourceMap: true }),
    ],
    external: Object.keys(pkg.peerDependencies),
    output: [{
      file: 'dist/es6/bundle.cjs.min.js',
      format: 'cjs',
    }, {
      file: 'dist/es6/bundle.iife.min.js',
      format: 'iife',
      name: 'DurationUnitFormat',
      globals: {
        'intl-messageformat': 'IntlMessageFormat',
      },
    }],
  },
];
