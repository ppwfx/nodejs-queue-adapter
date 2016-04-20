var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('test', shell.task(['mocha src/tests/**/*']));
gulp.task('test:helpers', shell.task(['mocha src/tests/helpers']));

