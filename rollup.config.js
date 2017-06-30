import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import postcss from 'rollup-plugin-postcss';
import postcssModules from 'postcss-modules';
import uglify from 'rollup-plugin-uglify';
import cssnext from 'postcss-cssnext';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

const cssExportMap = {};

export default {
  entry: 'src/Onboard.js',
  plugins: [
    postcss({
      plugins: [
        cssnext(),
        postcssModules({
          getJSON (id, exportTokens) {
            cssExportMap[id] = exportTokens;
          }
        })
      ],
      getExport (id) {
        return cssExportMap[id];
      }
    }),
    babel(babelrc()),
    uglify()
  ],
  globals:{
    "d3":"d3"
  },
  external: external,
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'Onboard',
      sourceMap: true
    }
  ]
};
