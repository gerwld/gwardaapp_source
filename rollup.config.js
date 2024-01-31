import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/assets/js/boba.js', // Replace with your entry file
  output: {
    file: 'build/bundle.js', // Replace with your desired output file
    format: 'iife',
  },
  plugins: [
    nodeResolve(), // Resolve external dependencies
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**', // Exclude node_modules from Babel
    }),
    terser(), // Minify JavaScript
  ],
};
