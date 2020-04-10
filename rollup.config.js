import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

export default [
  {
    input: 'index.js',
    external: Object.keys(pkg.peerDependencies),
    plugins: [
      filesize({ showMinifiedSize: false }),
    ],
    output: [{
      file: 'dist/cjs/duration-unit-format.cjs.js',
      format: 'cjs',
    }, {
      file: 'dist/esm/duration-unit-format.esm.js',
      format: 'esm',
    }],
  },
];
