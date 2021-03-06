import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import cssmin from 'gulp-cssmin';
import del from 'del';

gulp.task("webpack", () => {
    let conf = webpackConfig;
    conf.entry.main = './src/js/main.js';
    conf.output.filename = 'script.js';

    return webpackStream(conf, webpack).on('error', function (e) {
            this.emit('end');
        })
        .pipe(gulp.dest("./public/js/"))
        .unpipe(browserSync.reload());
});

gulp.task("sass", () => {
    return gulp.src("./src/scss/style.scss")
        .pipe(plumber())
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest("./public/css/"))
        .pipe(browserSync.stream());
});

gulp.task('copy', (c) => {
    gulp.src(['./src/html/**/*']).pipe(gulp.dest('./public/'));
    gulp.src(['./src/assets/**/*']).pipe(gulp.dest('./public/assets/'));
    c();
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "public",
            index: "index.html"
        },
        open: false
    });
});

gulp.task('reload', () => {
    browserSync.reload();
})

gulp.task('clean', (c) => {
    del([
        './public/',
    ]);
    c();
});

gulp.task('watch', () => {
    gulp.watch('./src/js/**/*', gulp.series('webpack'));
    gulp.watch('./src/scss/*.scss', gulp.task('sass'));
    gulp.watch('./src/**/*', gulp.task('copy'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel(
        'webpack', 'sass'
    ),
    'copy',
    gulp.parallel('browser-sync', 'watch'),
))