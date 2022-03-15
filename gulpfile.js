import gulp from 'gulp'
import browser from 'browser-sync';
import del from 'del';
import htmlmin from 'gulp-htmlmin';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import svgstore from 'gulp-svgstore';

//HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build/'));
}

// Styles

export const styles = () => {
  return gulp.src('source/scss/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//Scripts

const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
}

//Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'))
}

//WebP

const createWebP = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'));
}

const svg = () =>
  gulp.src(['source/img/**/*.svg', '!source/img/sprite/**/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));


const sprite = () => {
  return gulp.src('source/img/sprite/**/*.svg')
    .pipe(svgo())
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(svgstore({
      inlineSvg: false
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

//Clean

const clean = () => {
  return del('build');
}

//Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/*.webmanifest',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

//Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
    browser: "firefox"
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/*.html', gulp.series(html, reload));
  gulp.watch('source/scss/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
}

//Build
export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebP
  )
);

//Default
export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebP
  ),
  gulp.series(
    server,
    watcher
  )
);

