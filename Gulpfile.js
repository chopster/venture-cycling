const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-minify-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
// const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const del = require('del');
const clean = require('gulp-clean');
const watchSass = require("gulp-watch-sass")

/*
  Config for JS file paths
*/

const config = {
  scriptsrc: [
    'public/javascript'
  ]
}

gulp.task('clean:dist', function() {
  return del.sync(['public/css', 'public/javascript/script.min.js']);
})

/*
  Task to covert sass files to css
*/
gulp.task('sass', function(){
  return gulp.src('public/scss/style.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
});

gulp.task('cleanSass', function () {
  return del.sync(['public/css', 'public/javascript/script.min.js']);
  return gulp.src('public/css/style.min.css', {read: false})
      .pipe(clean());
});

/*
  Task to concat and minify css
*/
gulp.task('minifyConcatCSS', ['cleanSass', 'sass'], function(){
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

gulp.task("sass:watch", () => watchSass([
  "public/scss/*.scss"
])
  .pipe(sass())
  .pipe(minifyConcatCSS())
  .pipe(gulp.dest('public/css'))
);

/*
  Task to watch for changes
*/
gulp.task('watch', ['clean:dist', 'sass','minifyConcatCSS','bundle-script'], function(){
  gulp.watch('/public/scss/**/*.scss', ['sass']);
  gulp.watch('css/dev/*.css', ['minifyConcatCSS']);
  gulp.watch('javascript/dev/*.js', ['bundle-script']);
});

gulp.task('default');
