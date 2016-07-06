var gulp = require('gulp');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var webpack = require('webpack-stream');

gulp.task('html', function() {
    return gulp.src('./client/*.html')
        .pipe(gulp.dest('./build'));
});
gulp.task('css', function() {
    return gulp.src('./client/css/*.css')
        .pipe(gulp.dest('./build/css'));
});

gulp.task('lint', function() {
    return gulp.src('')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('webpack', function() {
    return gulp.src('./client/js/*.js')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('watch', function() {
    gulp.watch('./client/js/*.js', ['lint', 'webpack']);
});

gulp.task('default', ['lint', 'html', 'css', 'webpack', 'watch'], function() {
    return gutil.log('done everything');
});
