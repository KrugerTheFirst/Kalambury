var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var scss = require('gulp-scss');

gulp.task('images', function () {
    var imgSrc = './src/img/*',
        imgDst = './build/img/';

    return gulp.src(imgSrc)
        .pipe(gulp.dest(imgDst));
});

gulp.task("scss", function () {
    gulp.src(
        "./src/scss/*"
    ).pipe(scss(
        {}
    )).pipe(gulp.dest("./build/css/"));
});

gulp.task('minify-css', function () {
    return gulp.src('./build/css/*')
        .pipe(concat('main.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./build/main.min.css'));
});

gulp.task('scripts', function () {
    return gulp.src('./src/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('build', ['images', 'scss', 'minify-css', 'scripts']);