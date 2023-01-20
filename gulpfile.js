const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

gulp.task('clean:dist', function (callback) {
    del.sync('./dist/');
    callback();
});

gulp.task('scripts', function () {
    return gulp.src('./src/assets/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('common.min.js'))
        .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('scss', function () {
    return gulp.src('./src/assets/scss/**/*.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('browserSyncReload', function (callback) {
    browserSync.reload();
    callback();
});

gulp.task('html', function () {
    return new Promise(function (resolve, reject) {
        const proc = gulp.src('./src/*.html').pipe(fileInclude({
            prefix: '@@',
            basepath: '@file',
            indent: true,
        })).pipe(gulp.dest('./dist'));
        
        resolve(proc);
    });
});

gulp.task('watch', function () {
    gulp.watch('./src/assets/scss/**/*.scss', gulp.series(['scss', 'browserSyncReload']));
    gulp.watch('./src/*.html', gulp.series(['html', 'browserSyncReload']));
});

// Static server
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
});


gulp.task('default', gulp.series(['clean:dist', 'scripts', 'scss', 'html'], gulp.parallel('browserSync', 'watch')));