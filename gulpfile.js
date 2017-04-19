var gulp = require('gulp');


gulp.task('images', function() {
    var imgSrc = './src/img/*',
        imgDst = './build/img/';

    return gulp.src(imgSrc)
        .pipe(gulp.dest(imgDst));
});