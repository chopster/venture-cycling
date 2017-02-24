var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var del = require('del');

/*
  Config for JS file paths
*/

var config = {
  scriptsrc: [
    'public/javascript'
  ]
}

gulp.task('clean:dist', function() {
  return del.sync('public/css');
})

/*
  Task to covert sass files to css
*/
gulp.task('sass', function(){
  return gulp.src('public/scss/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
});

/*
  Task to concat and minify css
*/
gulp.task('minifyConcatCSS', ['sass'], function(){
  return gulp.src('public/css/*.css')
    .pipe(concat('style.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('public/css'))
});

/*
  Task to concat and minify js script
*/
gulp.task('bundle-script', function() {
  return gulp.src('public/javascript/*.js')
  .pipe(concat('script.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public/javascript'))
});

/*
  Task to concat and minify js script
*/
gulp.task('image-optimise', function() {
  return gulp.src('public/images/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('public/images'))
});


/*
  Task to watch for changes
*/
gulp.task('watch', ['clean:dist', 'sass','minifyConcatCSS','bundle-script'], function(){
  gulp.watch('scss/**/*.scss', ['sass']); 
  gulp.watch('css/dev/*.css', ['minifyConcatCSS']);
  gulp.watch('javascript/dev/*.js', ['bundle-script']);
});

gulp.task('default', ['watch']);