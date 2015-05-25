var gulp = require('gulp'),         
    browserify = require('browserify'),  
    sass = require('gulp-ruby-sass'),
    mbf = require('main-bower-files'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber')
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    watch = require('gulp-watch'),
    minifyify = require('minifyify'),
    livereload = require('gulp-livereload'),
    stream = require('vinyl-source-stream');

// gulp.task('bower-js', function () {  
//   gulp.src(mbf({includeDev: true}).filter(function (f) { return f.substr(-2) === 'js'; }))
//     .pipe(concat('vendor.js'))
//     .pipe(gulp.dest('dist/build/js'))    
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(uglify())    
//     .pipe(gulp.dest('dist/assets/js/'));
// });


// 合并、压缩、重命名css
// gulp.task('stylesheets',['build-less'], function() {
//     // 注意这里通过数组的方式写入两个地址,仔细看第一个地址是css目录下的全部css文件,第二个地址是css目录下的areaMap.css文件,但是它前面加了!,这个和.gitignore的写法类似,就是排除掉这个文件.
//   gulp.src('./src/styles/*.css')
//     .pipe(concat('all.css'))
//     .pipe(gulp.dest('./dist/build/css/'))
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(minifycss())
//     .pipe(gulp.dest('./dist/build/css'));
// });

// 解析sass成css 并合并，压缩
gulp.task('styles', function() {  
  return sass('./src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/build/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./dist/assets/css'))
});

// 生成js文件
gulp.task('scripts', function() {
  return browserify('./src/js/demo.js')
    .bundle()
    .pipe(plumber())
    .pipe(stream('all.js'))
    .pipe(gulp.dest('./dist/build/js'))
});

//压缩js文件
gulp.task('mini-js', ['scripts'], function() {
  gulp.src('./dist/build/js/all.js')
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js'));
});

// bower css文件整合
gulp.task('bower-css', function () {  
  gulp.src(mbf({includeDev: true}).filter(function (f) { return f.substr(-3) === 'css'; }))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./dist/build/css'))    
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())   
    .pipe(gulp.dest('./dist/assets/css/'));
});

gulp.task('icons', function() { 
    return gulp.src('./bower_components/bootstrap/fonts/**.*') 
        .pipe(gulp.dest('./dist/assets/css/fonts/')); 
});

// 清空图片、样式、js
gulp.task('clean', function() {
  return gulp.src(['./dist/build/css/main.css','./dist/assets/css/main.min.css','./dist/build/js/all.js','./dist/assets/js/all.min.js'], {read: false})
    .pipe(clean({force: true}));
});

// 定义develop任务在日常开发中使用
gulp.task('watch',function(){
  gulp.watch('./src/styles/*.scss', ['styles']);
  gulp.watch('./src/js/*.js', ['scripts','mini-js']);
});

// 定义一个prod任务作为发布或者运行时使用
gulp.task('prod', ['styles','scripts','mini-js','bower-css','icons', 'watch']);

// gulp命令默认启动的就是default认为,这里将clean任务作为依赖,也就是先执行一次clean任务,流程再继续.
gulp.task('default', ['styles','scripts','mini-js','bower-css','icons', 'watch']);
