const path = require('path');
const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');
const pug = require('gulp-pug');
const cheerio = require('cheerio');
const through2 = require('through2');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
//const cached = require('gulp-cached');
const concat = require('gulp-concat');

function reload(done) {
  browserSync.reload();
  done();
}

// Public
gulp.task('copy', () => {
  return gulp.src('src/public/**/*', { encoding: false })
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// JS
gulp.task('js:common', () => {
  return gulp.src('src/app/js/**/*js')
    .pipe(concat('common.js'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.stream());
});
gulp.task('js:components', () => {
  return gulp.src('src/components/**/*.js')
    .pipe(rename((path) => {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.js';
    }))
    .pipe(gulp.dest('dist/js/components/'))
    .pipe(browserSync.stream());
});
gulp.task('js:blocks', () => {
  return gulp.src('src/blocks/**/*.js')
    .pipe(rename((path) => {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.js';
    }))
    .pipe(gulp.dest('dist/js/blocks/'))
    .pipe(browserSync.stream());
});
gulp.task('js:pages', () => {
  return gulp.src('src/pages/**/*.js')
    .pipe(rename((path) => {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.js';
    }))
    .pipe(gulp.dest('dist/js/pages/'))
    .pipe(browserSync.stream());
});

// Pug
gulp.task('pug', () => {
  return gulp.src('src/pages/**/*.pug')
    .pipe(pug({
      pretty: true,
      basedir: path.join(__dirname, 'src'),
      locals: {

      }
    }))
    .pipe(through2.obj(function (file, enc, cb) {
      if (file.isNull()) {
        return cb(null, file);
      }

      try {
        const $ = cheerio.load(file.contents.toString(), {
          decodeEntities: false,
          xmlMode: false,
          recognizeSelfClosing: true
        });

        // Находим блок с стилями
        const stylesBlock = $('.styles-to-head-transfer');

        if (stylesBlock.length) {
          // Получаем HTML содержимое блока
          const stylesContent = stylesBlock.html();

          // Перемещаем содержимое в head
          $('head').append(stylesContent);

          // Удаляем исходный блок
          stylesBlock.remove();

          // Обновляем содержимое файла
          file.contents = Buffer.from($.html());
        }

        this.push(file);
        return cb();
      } catch (err) {
        return cb(err);
      }
    }))
    .pipe(rename({
      dirname: '',
      extname: '.html'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// Стили
gulp.task('styles:common', () => {
  return gulp.src(['src/app/scss/index.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('common.css'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream());
});

gulp.task('styles:components', () => {
  return gulp.src(['src/components/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(rename((path) => {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.css';
    }))
    .pipe(gulp.dest('dist/css/components'))
    .pipe(browserSync.stream());
});

gulp.task('styles:blocks', () => {
  return gulp.src(['src/blocks/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(rename((path) => {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.css';
    }))
    .pipe(gulp.dest('dist/css/blocks'))
    .pipe(browserSync.stream());
});

gulp.task('styles:pages', () => {
  return gulp.src(['src/pages/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(rename((path) => {
      path.basename = path.dirname;
      path.dirname = '';
      path.extname = '.css';
    }))
    .pipe(gulp.dest('dist/css/pages'))
    .pipe(browserSync.stream());
});

// BrowserSync
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });

  // Вотчеры
  gulp.watch([
    'src/app/**/*.pug',
    'src/components/**/*.pug',
    'src/blocks/**/*.pug',
    'src/pages/**/*.pug'
  ], gulp.series('pug'));

  gulp.watch(['src/app/scss/**/*.scss'], gulp.series('styles:common'));
  gulp.watch(['src/components/**/*.scss'], gulp.series('styles:components'));
  gulp.watch(['src/blocks/**/*.scss'], gulp.series('styles:blocks'));
  gulp.watch(['src/pages/**/*.scss'], gulp.series('styles:pages'));

  gulp.watch(['src/app/js/**/*.js'], gulp.series('js:common'));
  gulp.watch(['src/components/**/*.js'], gulp.series('js:components'));
  gulp.watch(['src/blocks/**/*.js'], gulp.series('js:blocks'));
  gulp.watch(['src/pages/**/*.js'], gulp.series('js:pages'));

  gulp.watch(['src/sprite/sprite.svg', 'src/data/**/*'], gulp.series('pug'));
  gulp.watch(['src/public/**/*'], gulp.series('copy'));
});



gulp.task('clean', function () {
  return gulp.src('dist', { read: false, allowEmpty: true }).pipe(clean());
});

// Задача по умолчанию
gulp.task('default', gulp.series(
  'clean',
  'copy',
  gulp.parallel(
    'pug',
    'styles:common',
    'styles:components',
    'styles:blocks',
    'styles:pages',
    'js:common',
    'js:components',
    'js:blocks',
    'js:pages'
  ),
  'serve'));


gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({
      branch: 'dist'
    }));
});

gulp.task('build', gulp.series(
  'clean',
  'copy',
  gulp.parallel(
    'pug',
    'styles:common',
    'styles:components',
    'styles:blocks',
    'styles:pages',
    'js:common',
    'js:components',
    'js:blocks',
    'js:pages'
  )
));
