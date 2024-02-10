//   - This file is part of GwardaApp Extension
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

// Note: Amazon is a registered trademark of Amazon and all related Marks are Trademarks of Amazon.com, Inc. or its affiliates. This extension is not affiliated with or endorsed by Amazon.com, Inc or / and its affiliates.


import gulp from 'gulp';
import svgmin from 'gulp-svgmin';
import zip from 'gulp-zip';
import filter from 'gulp-filter';
import autoprefix from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import gulpFlatten from 'gulp-flatten';
import insert from 'gulp-insert';
import uglify from 'gulp-uglify';
import htmlmin from "gulp-htmlmin";
import rename from "gulp-rename";
import replace from "gulp-replace";
import shell from 'gulp-shell';
import chalk from 'chalk';
import stripDebug from 'gulp-strip-debug';

let { src, dest, task, series, watch, on } = gulp;
const link = chalk.hex('#5e98d9');
const EXTENSION_NAME = 'gwardaapp'
const EXTENSION_V = 'v.0.9.5'
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


// Note: Amazon is a registered trademark of Amazon and all related Marks are Trademarks of Amazon.com, Inc. or its affiliates. This extension is not affiliated with or endorsed by Amazon.com, Inc or / and its affiliates.
`

//## Minify Images  ##//
task('minifyImg', async function () {
    src(['./src/assets/img/*.svg', './src/assets/img/**/*.svg'])
        .pipe(svgmin())
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/img/'))
        .pipe(dest('./dist/firefox/assets/img/'))

    src(['./src/assets/img/*.png', './src/assets/img/**/*.png', './src/assets/img/*.gif'])
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/img/'))
        .pipe(dest('./dist/firefox/assets/img/'))

    src(['./src/assets/img/icons/*.png', './src/assets/img/icons/**/*.png'])
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/img/icons/'))
        .pipe(dest('./dist/firefox/assets/img/icons/'))

    src(['./src/assets/img/**/*.md'])
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/img/'))
        .pipe(dest('./dist/firefox/assets/img/'))
});

//## Minify CSS  ##//
task('minifyCSS', async function () {
    src(['./src/assets/styles/*.css', './src/assets/styles/**/*.css', './src/assets/styles/**/**/*.css'])
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(autoprefix('last 2 versions'))
        .pipe(insert.prepend(`/*\n${COPYRIGHT}*/\n\n`))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/firefox/assets/styles/'))

    src(['./src/assets/styles/*.css', './src/assets/styles/**/*.css', './src/assets/styles/**/**/*.css'])
        .pipe(replace('moz-extension://', 'chromium-extension://'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(autoprefix('last 2 versions'))
        .pipe(insert.prepend(`/*\n${COPYRIGHT}*/\n\n`))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/styles/'))
});

//## Minify JS ##//
task('minifyJS', async function () {
    src(['./src/assets/js/*.js', './src/assets/js/pages/*.js'])
        .pipe(
            filter(['**', '!**/content.js', '!**/background.js', '!**/rate_popup.js', '!**/__*.js'])
        )
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(insert.prepend(COPYRIGHT))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/assets/js/'))
        .pipe(dest('./dist/firefox/assets/js/'))

});

task('babelRollup', async function (done) {
    src('.')
        .pipe(shell(['npx rollup -c rollup.config.js']))
});

//## Minify HTML ##//
task('minifyHTML', async function () {
    src(['./src/content/*.html'])
        .pipe(
            filter(['**', '!**/__*.html'])
        )
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(insert.prepend(`<!--\n${COPYRIGHT}-->\n\n`))
        .pipe(gulpFlatten({ includeParents: 4 }))
        .pipe(dest('./dist/chromium/content/'))
        .pipe(dest('./dist/firefox/content/'))
});


//## Add other files  ##//
task('addOther', async function () {
    src(['./LICENSE.md', './package.json', './README.md', './SECURITY.md', './CONTRIBUTING.md'])
        .pipe(dest('./dist/chromium'))
        .pipe(dest('./dist/firefox'))
        .pipe(dest('./dist/'))

    src('./src/manifest-chromium.json').pipe(rename("manifest.json")).pipe(dest('./dist/chromium'));
    src('./src/manifest-firefox.json').pipe(rename("manifest.json")).pipe(dest('./dist/firefox'));

    src(['./src/_locales/**/*'])
        .pipe(dest('./dist/chromium/_locales'))
        .pipe(dest('./dist/firefox/_locales'))
});

//## For source code .zip ##//
task('source', async function (done) {
    const excludedDirs = ['dist', 'node_modules', 'previews', '.git'];
    const excludedFiles = ['**', '!**/__*.js', '!**/*.zip', '.git', '.gitignore', '.DS_Store'];

    src("./**/*")
        .pipe(filter(['**', ...excludedFiles]))
        .pipe(filter(['**', ...excludedDirs.map(e => [`!./${e}/**/*`, `!./${e}/`]).flat(2)]))
        .pipe(dest('./dist/__source_code/'))

    src("./**/*")
        .pipe(filter(['**', ...excludedFiles]))
        .pipe(filter(['**', ...excludedDirs.map(e => [`!./${e}/**/*`, `!./${e}/`]).flat(2)]))
        .pipe(zip(`${EXTENSION_NAME}_${EXTENSION_V}_source_code.zip`))
        .pipe(gulp.dest('./dist/'))
        .on('end', function () {
            console.log("Source finished, dest: " + link(`./dist/${EXTENSION_NAME}_${EXTENSION_V}_source_code.zip`));
            done();
        })
});



task('zipper', async function (done) {
    setTimeout(function () {
        const fn_base = `${EXTENSION_NAME}_${EXTENSION_V}`
        console.log(chalk.green("Zipper started."));
        src("./dist/firefox/**/*")
            .pipe(zip(`${fn_base}_firefox.zip`))
            .pipe(gulp.dest('./dist/'))
            .on('end', function () {
                console.log("Zipper finished, dest: " + link(`./dist/${fn_base}_firefox.zip`));
                done();
            });
        src("./dist/chromium/**/*")
            .pipe(zip(`${fn_base}_chromium.zip`))
            .pipe(gulp.dest('./dist/'))
            .on('end', function () {
                console.log("Zipper finished, dest: " + link(`./dist/${fn_base}_chromium.zip`));
                done();
            });
    }, 6000);
});

//## Firefox ##//
gulp.task('webext', function () {
    src('.')
        .pipe(shell(['cd ./dist/firefox && web-ext run']))
});

//## Main build task (both browser_cr and Firefox) ##//
task('build', series('minifyImg', "minifyCSS", "minifyJS", "minifyHTML", "addOther", 'babelRollup'));
task('build_md', series('minifyImg', "minifyCSS", "minifyJS", "minifyHTML", "addOther", 'babelRollup', 'source', 'zipper'));

//## Main development task (both browser_cr and Firefox) ##//
task('dev_watch', () => {
    series("build")
    watch('./src/assets/**/*.js', series('minifyJS', 'babelRollup'))
    watch('./src/content/**/*.html', series('minifyHTML'))
    watch('./src/assets/**/*.css', series('minifyCSS'))
    watch('./src/assets/img/**/*', series('minifyImg'))
    watch(['./src/*.json', './src/*.md'], series('addOther'))
});

task('dev', series('build', 'dev_watch'));


export default series('dev');
