import gulp from 'gulp';
import svgmin from 'gulp-svgmin';
import autoprefix from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import gulpFlatten from 'gulp-flatten';
import insert from 'gulp-insert';
import uglify from 'gulp-uglify';
import htmlmin from "gulp-htmlmin";
import rename from "gulp-rename";
import replace from "gulp-replace";
import shell from 'gulp-shell';
import webExt from 'web-ext';

let { src, dest, task, series } = gulp;
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

//## Minify Images  ##//
task('minifyImg', async function () {
    src(['./src/assets/img/*.svg', './src/assets/img/**/*.svg'])
        .pipe(svgmin())
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./build/chromium/assets/img/'))
        .pipe(dest('./build/firefox/assets/img/'))

    src(['./src/assets/img/*.png', './src/assets/img/**/*.png'])
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./build/chromium/assets/img/'))
        .pipe(dest('./build/firefox/assets/img/'))

    src(['./src/assets/icons/*.png', './src/assets/icons/**/*.png'])
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./build/chromium/assets/icons/'))
        .pipe(dest('./build/firefox/assets/icons/'))

    src(['./src/assets/img/**/*.md'])
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./build/chromium/assets/img/'))
        .pipe(dest('./build/firefox/assets/img/'))
});

//## Minify CSS  ##//
task('minifyCSS', async function () {
    src(['./src/assets/styles/*.css', './src/assets/styles/**/*.css', './src/assets/styles/**/**/*.css'])
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(autoprefix('last 2 versions'))
        .pipe(insert.prepend(`/*\n${COPYRIGHT}*/\n\n`))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./build/firefox/assets/styles/'))

    src(['./src/assets/styles/*.css', './src/assets/styles/**/*.css', './src/assets/styles/**/**/*.css'])
        .pipe(replace('moz-extension://', 'chromium-extension://'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(autoprefix('last 2 versions'))
        .pipe(insert.prepend(`/*\n${COPYRIGHT}*/\n\n`))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./build/chromium/assets/styles/'))
});

//## Minify JS ##//
task('minifyJS', async function () {
    src(['./src/assets/js/*.js'])
        .pipe(uglify())
        .pipe(insert.prepend(COPYRIGHT))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./build/chromium/assets/js/'))
        .pipe(dest('./build/firefox/assets/js/'))
});

task('babel_rollup_part', async function () {
    src('.')
        .pipe(shell(['npx rollup -c rollup.config.js']));
});

//## Minify HTML ##//
task('minifyHTML', async function () {
    src(['./src/content/*.html'])
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(insert.prepend(`<!--\n${COPYRIGHT}-->\n\n`))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./build/chromium/content/'))
        .pipe(dest('./build/firefox/content/'))
});


//## Add other files  ##//
task('addOther', async function () {
    src(['./LICENSE.md', './package.json', './README.md', './SECURITY.md', './CONTRIBUTING.md'])
        .pipe(dest('./build/chromium'))
        .pipe(dest('./build/firefox'))

    src('./src/manifest-chromium.json').pipe(rename("manifest.json")).pipe(dest('./build/chromium'));
    src('./src/manifest-firefox.json').pipe(rename("manifest.json")).pipe(dest('./build/firefox'));

    src(['./src/_locales/**/*'])
        .pipe(dest('./build/chromium/_locales'))
        .pipe(dest('./build/firefox/_locales'))
});

//## SOURCE CODE ##//
task('source', async function () {
    src(['./LICENSE.md', './package.json', './README.md', './SECURITY.md', './CONTRIBUTING.md', "./HOW_TO_FOR_FIREFOX_MODERATORS.txt"])
        .pipe(dest('./build/source_code'));
    src('./src/manifest-chromium.json').pipe(dest('./build/source_code'));
    src('./src/manifest-firefox.json').pipe(dest('./build/source_code'));
    src(['./src/_locales/**/*'])
        .pipe(dest('./build/source_code/_locales'))
    src(['./src/assets/**/*'])
        .pipe(dest('./build/source_code/assets'))
    src(['./src/content/*.html'])
        .pipe(dest('./build/source_code/content/'))

});

//## Chrome extension reloader ##//
task('reloadChrome', function () {
    return src('build/chromium')
    // .pipe(reloader());
});

//## Watch for changes and reload Chrome ##//
task('watchChrome', function () {
    watch('src/**/*', series('reloadChrome'));
});

//## Firefox extension development task ##//
task('developFirefox', function () {
    return webExt.cmd.run({
        sourceDir: 'build/firefox',
        overwriteDest: true,
    });
});

//## Watch for changes and reload Firefox ##//
task('watchFirefox', function () {
    watch('src/**/*', series('developFirefox'));
});

//## Main build task (both Chrome and Firefox) ##//
task('build', series('minifyImg', "minifyCSS", "minifyJS", "minifyHTML", "addOther", 'babel_rollup_part', 'source'));

//## Main development task (both Chrome and Firefox) ##//
task('dev', series('minifyImg', 'minifyCSS', 'minifyJS', 'minifyHTML', 'addOther', 'babel_rollup_part', 'reloadChrome', 'developFirefox', 'watchChrome', 'watchFirefox'));
export default series('build');
