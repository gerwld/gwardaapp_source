import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';



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
      resolve({
        preserveSymlinks: true,
      }),
      commonjs({
        preserveSymlinks: true,
      }),
      replace({
        delimiters: ['', ''], // to avoid adding extra quotes around the replacement
        values: {
          'CSSOM.CSSStyleSheet = requireCSSStyleSheet().CSSStyleSheet;': 'CSSOM.CSSStyleSheet = requireCSSStyleSheet()?.CSSStyleSheet;',
          'CSSOM.CSSStyleRule = requireCSSStyleRule().CSSStyleRule;': 'CSSOM.CSSStyleRule = requireCSSStyleRule()?.CSSStyleRule;',
          'CSSOM.CSSImportRule = requireCSSImportRule().CSSImportRule;': 'CSSOM.CSSImportRule = requireCSSImportRule()?.CSSImportRule;',
          'CSSOM.CSSGroupingRule = CSSGroupingRule.CSSGroupingRule;': 'CSSOM.CSSGroupingRule = CSSGroupingRule?.CSSGroupingRule;',
          'CSSOM.CSSMediaRule = CSSMediaRule.CSSMediaRule;': 'CSSOM.CSSMediaRule = CSSMediaRule?.CSSMediaRule;',
          'CSSOM.CSSConditionRule = CSSConditionRule.CSSConditionRule;': 'CSSOM.CSSConditionRule = CSSConditionRule?.CSSConditionRule;',
          'CSSOM.CSSSupportsRule = CSSSupportsRule.CSSSupportsRule;': 'CSSOM.CSSSupportsRule = CSSSupportsRule?.CSSSupportsRule;',
          'CSSOM.CSSFontFaceRule = requireCSSFontFaceRule().CSSFontFaceRule;': 'CSSOM.CSSFontFaceRule = requireCSSFontFaceRule()?.CSSFontFaceRule;',
          'CSSOM.CSSHostRule = CSSHostRule.CSSHostRule;': 'CSSOM.CSSHostRule = CSSHostRule?.CSSHostRule;',
          'CSSOM.CSSStyleDeclaration = requireCSSStyleDeclaration().CSSStyleDeclaration;': 'CSSOM.CSSStyleDeclaration = requireCSSStyleDeclaration()?.CSSStyleDeclaration;',
          'CSSOM.CSSKeyframeRule = requireCSSKeyframeRule().CSSKeyframeRule;': 'CSSOM.CSSKeyframeRule = requireCSSKeyframeRule()?.CSSKeyframeRule;',
          'CSSOM.CSSKeyframesRule = CSSKeyframesRule.CSSKeyframesRule;': 'CSSOM.CSSKeyframesRule = CSSKeyframesRule?.CSSKeyframesRule;',
          'CSSOM.CSSValueExpression = CSSValueExpression.CSSValueExpression;': 'CSSOM.CSSValueExpression = CSSValueExpression?.CSSValueExpression;',
          'CSSOM.CSSDocumentRule = CSSDocumentRule.CSSDocumentRule;': 'CSSOM.CSSDocumentRule = CSSDocumentRule?.CSSDocumentRule;',
          'MediaList: MediaList.MediaList': 'MediaList: MediaList?.MediaList',
          'CSSOM.CSSValueExpression = CSSValueExpression.CSSValueExpression;': 'CSSOM.CSSValueExpression = CSSValueExpression?.CSSValueExpression;',
          'CSSKeyframeRule.CSSKeyframeRule = CSSOM.CSSKeyframeRule;': 'CSSKeyframeRule.CSSKeyframeRule = CSSOM?.CSSKeyframeRule;',
          'CSSImportRule.CSSImportRule = CSSOM.CSSImportRule;': 'CSSImportRule.CSSImportRule = CSSOM?.CSSImportRule;'
        }
      }),

      // terser(), // Minify JavaScript
      prependBannerPlugin({ banner: COPYRIGHT })
    ],
  },
  {
    input: 'src/assets/js/background.js',
    output: [
      {
        file: 'dist/chromium/assets/js/background.js',
        // format: 'iife',
      }, {
        file: 'dist/firefox/assets/js/background.js',
        // format: 'iife',
      },
    ],

    plugins: [
      resolve({
        preserveSymlinks: true,
      }),
      commonjs({
        preserveSymlinks: true,
      }),
      replace({
        delimiters: ['', ''], // to avoid adding extra quotes around the replacement
        values: {
          'CSSOM.CSSStyleSheet = requireCSSStyleSheet().CSSStyleSheet;': 'CSSOM.CSSStyleSheet = requireCSSStyleSheet()?.CSSStyleSheet;',
          'CSSOM.CSSStyleRule = requireCSSStyleRule().CSSStyleRule;': 'CSSOM.CSSStyleRule = requireCSSStyleRule()?.CSSStyleRule;',
          'CSSOM.CSSImportRule = requireCSSImportRule().CSSImportRule;': 'CSSOM.CSSImportRule = requireCSSImportRule()?.CSSImportRule;',
          'CSSOM.CSSGroupingRule = CSSGroupingRule.CSSGroupingRule;': 'CSSOM.CSSGroupingRule = CSSGroupingRule?.CSSGroupingRule;',
          'CSSOM.CSSMediaRule = CSSMediaRule.CSSMediaRule;': 'CSSOM.CSSMediaRule = CSSMediaRule?.CSSMediaRule;',
          'CSSOM.CSSConditionRule = CSSConditionRule.CSSConditionRule;': 'CSSOM.CSSConditionRule = CSSConditionRule?.CSSConditionRule;',
          'CSSOM.CSSSupportsRule = CSSSupportsRule.CSSSupportsRule;': 'CSSOM.CSSSupportsRule = CSSSupportsRule?.CSSSupportsRule;',
          'CSSOM.CSSFontFaceRule = requireCSSFontFaceRule().CSSFontFaceRule;': 'CSSOM.CSSFontFaceRule = requireCSSFontFaceRule()?.CSSFontFaceRule;',
          'CSSOM.CSSHostRule = CSSHostRule.CSSHostRule;': 'CSSOM.CSSHostRule = CSSHostRule?.CSSHostRule;',
          'CSSOM.CSSStyleDeclaration = requireCSSStyleDeclaration().CSSStyleDeclaration;': 'CSSOM.CSSStyleDeclaration = requireCSSStyleDeclaration()?.CSSStyleDeclaration;',
          'CSSOM.CSSKeyframeRule = requireCSSKeyframeRule().CSSKeyframeRule;': 'CSSOM.CSSKeyframeRule = requireCSSKeyframeRule()?.CSSKeyframeRule;',
          'CSSOM.CSSKeyframesRule = CSSKeyframesRule.CSSKeyframesRule;': 'CSSOM.CSSKeyframesRule = CSSKeyframesRule?.CSSKeyframesRule;',
          'CSSOM.CSSValueExpression = CSSValueExpression.CSSValueExpression;': 'CSSOM.CSSValueExpression = CSSValueExpression?.CSSValueExpression;',
          'CSSOM.CSSDocumentRule = CSSDocumentRule.CSSDocumentRule;': 'CSSOM.CSSDocumentRule = CSSDocumentRule?.CSSDocumentRule;',
          'MediaList: MediaList.MediaList': 'MediaList: MediaList?.MediaList',
          'CSSOM.CSSValueExpression = CSSValueExpression.CSSValueExpression;': 'CSSOM.CSSValueExpression = CSSValueExpression?.CSSValueExpression;',
          'CSSKeyframeRule.CSSKeyframeRule = CSSOM.CSSKeyframeRule;': 'CSSKeyframeRule.CSSKeyframeRule = CSSOM?.CSSKeyframeRule;',
          'CSSImportRule.CSSImportRule = CSSOM.CSSImportRule;': 'CSSImportRule.CSSImportRule = CSSOM?.CSSImportRule;'

        }
      }),
      // terser(), // Minify JavaScript
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
