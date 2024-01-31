import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const COPYRIGHT = `//   - This file is part of GwardaApp Extension
//  <https://github.com/gerwld/GwardaApp-extension/blob/main/README.md>,
//   - Copyright (C) 2023-present GwardaApp Extension
//   -
//   - GwardaApp Extension is a software: you can redistribute it, but you are not allowed to modify it under the terms of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
//   -
//   - GwardaApp Extension is distributed in the hope that it will be useful,
//   - but WITHOUT ANY WARRANTY; without even the implied warranty of
//   - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   - Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License for more details.
//   -
//   - You should have received a copy of the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License
//   - along with GwardaApp Extension.  If not, see <https://creativecommons.org/licenses/by-nc-nd/4.0/>.

// Note: Amazon is a registered trademark of Amazon AB. This extension is not affiliated with or endorsed by Amazon AB.
`

export default [
  {
    input: 'src/assets/js/content.js',
    output: [
      {
        file: 'dist/chromium/assets/js/content.js',
        format: 'iife',
      }, {
        file: 'dist/firefox/assets/js/content.js',
        format: 'iife',
      },
    ],
    plugins: [
      nodeResolve(), // Resolve external dependencies
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**', // Exclude node_modules from Babel
      }),
      terser(), // Minify JavaScript
      prependBannerPlugin({ banner: COPYRIGHT })
    ],
  }
];


function prependBannerPlugin(options) {
  return {
    name: 'prepend-banner-plugin',
    renderChunk(code) {
      return `${options.banner}\n${code}`;
    },
  };
}