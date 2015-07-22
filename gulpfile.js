var gulp = require('gulp'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
//imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create();

var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');

gulp.task('html', function(){
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
});

// 压缩css
gulp.task('css', function(){

    // 找到文件
    sass('client/scss', {sourcemap: true, style: 'compact'})
    //gulp.src('scss/*.scss')
        // map文件初始化
        //.pipe(sourcemaps.init())
        /*错误跟踪*/
        .pipe(plumber())
        // 合并文件
        //.pipe(concat('main.css'))
        // scss编译
        //.pipe(sass())
        //.pipe(sourcemaps('.'))
        .pipe(sourcemaps.write())
        // 压缩文件
        //.pipe(minifyCSS())
        // 重命名
        ///.pipe(rename({suffix: '.min'}))
        // 添加浏览器前缀
        .pipe(autoprefixer({
            browsers: [
                'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
            ],
            cascade: false
        }))
        // 写入map文件路径
        //.pipe(sourcemaps.write())
        // 另存为压缩文件
        .pipe(gulp.dest('client/css'))
        // 注入css
        .pipe(browserSync.stream());

});

// 压缩js
gulp.task('js', function(){

    gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/js'))

});

// 压缩图片
/*gulp.task('image', function(){
 gulp.src('src/images/!*.*')
 .pipe(rename({suffix: '.min'}))
 .pipe(imagemin({
 progressive: true
 }))
 .pipe(gulp.dest('dist/images'))

 });*/

// 监听文件修改
gulp.task('auto', function(){
    gulp.watch('client/scss/*.scss', ['css']);
    //gulp.watch('src/js/*.js', ['js']);
    //gulp.watch('src/images/*.*', ['images']);
    //gulp.watch('src/*.html', ['html']);
});

// Static Server + watching scss/html files
gulp.task('serve', ['css', 'js', 'html'], function() {

    browserSync.init({
        server: "."
    });

    gulp.watch('scss/*.scss', ['css']);
    //gulp.watch('src/js/*.js', ['js']);
    //gulp.watch('src/images/*.*', ['images']);
    //gulp.watch('src/*.html', ['html']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("js/*.js").on('change', browserSync.reload);
    //gulp.watch("dist/js/*.js").on('change', browserSync.reload);
});

//默认任务
gulp.task('default', ['css', 'js', 'html','auto']);