const gulp = require('gulp');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const imagemin = import('gulp-imagemin');
const concat = require('gulp-concat');
const jsImport = require('gulp-js-import');
const sourcemaps = require('gulp-sourcemaps');
const htmlPartial = require('gulp-html-partial');
const fileinclude = require('gulp-file-include');
const clean = require('gulp-clean');
const isProd = process.env.NODE_ENV === 'prod';

const htmlFile = [
    'src/**/*.html'
]

function html() {
    return gulp.src(htmlFile)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/partials/'
        }))
        .pipe(gulpIf(isProd, htmlmin({
            collapseWhitespace: true
        })))
        .pipe(gulp.dest('html'));
}

function css() {
    return gulp.src('src/assets/sass/style.scss')
        .pipe(gulpIf(!isProd, sourcemaps.init()))
        .pipe(sass({
            includePaths: ['node_modules']
        }).on('error', sass.logError))
        .pipe(gulpIf(!isProd, sourcemaps.write()))
        .pipe(gulpIf(isProd, cssmin()))
        .pipe(gulp.dest('html/assets/css/'));
}

function js() {
    return gulp.src('src/assets/js/*.js')
        .pipe(jsImport({
            hideConsole: true
        }))
        .pipe(concat('all.js'))
        .pipe(gulpIf(isProd, uglify()))
        .pipe(gulp.dest('html/assets/js'))
}

function img() {
    return gulp.src('src/assets/images/**')
        .pipe(gulp.dest('html/assets/images/'))
}

function cssPri() {
    return gulp.src('src/assets/css/*.css')
        .pipe(gulp.dest('html/assets/css/'))
}

function serve() {
    browserSync.init({
        open: true,
        server: './html'
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}


function watchFiles() {
    gulp.watch('src/**/*.html', gulp.series(html, browserSyncReload));
    gulp.watch('src/assets/**/*.scss', gulp.series(css, browserSyncReload));
    gulp.watch('src/assets/**/*.css', gulp.series(cssPri, browserSyncReload));
    gulp.watch('src/assets/**/*.js', gulp.series(js, browserSyncReload));
    gulp.watch('src/assets/images/**/*.*', gulp.series(img, browserSyncReload));

    return;
}

function del() {
    return gulp.src('html/*', {read: false})
        .pipe(clean());
}

exports.css = css;
exports.cssPri = cssPri;
exports.html = html;
exports.js = js;
exports.img = img;
exports.del = del;

exports.default = gulp.parallel(html, css, cssPri, js, img, watchFiles, serve);
exports.build = gulp.series(del, html, css, cssPri, js, img);
