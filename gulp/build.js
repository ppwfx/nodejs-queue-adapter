var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('build', function () {
    var runSequence = require('run-sequence');

    runSequence('purge_previous_build', 'transpile');
});

gulp.task('purge_previous_build',  shell.task(['rm -r ./src/* &>/dev/null']));

gulp.task('transpile', function () {
    var tsc = require('gulp-tsc');

    var src ='./typescript/**/*.ts';
    var dest = './src';

    return gulp.src(
        src
        )
        .pipe(tsc({
            module: "commonjs",
            emitError: false
        }))
        .pipe(gulp.dest(dest));
});