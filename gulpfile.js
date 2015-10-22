var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  eslint = require('gulp-eslint');

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      // fallback: 'index.html',
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('watch', function() {
  gulp.watch(['./*.html', './js/*.js', './css/*.css'], ['lint']);
});

gulp.task('lint', function() {
  return gulp.src(['js/*.js'])
    // eslint() attaches the lint output to the eslint property 
    // of the file object so it can be used by other modules. 
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console. 
    // Alternatively use eslint.formatEach() (see Docs). 
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on 
    // lint error, return the stream and pipe to failOnError last. 
    .pipe(eslint.failOnError());
});

gulp.task('default', ['lint', 'watch', 'webserver']);
