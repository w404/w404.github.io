// 引入 gulp
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();

// 引入组件
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// 管理资源文件路径集合
var config = {};

// 源资源文件路径
config['assets'] = {
    less: './less/**.*',
    less_files: ['./less/index.less', './less/help.less', './less/product.less', './less/about.less', './less/advertise.less']
};


//定义一个testLess任务（自定义任务名称）
gulp.task('less', function() {
    gulp.src(config['assets'].less_files) //该任务针对的文件
        .pipe($.less()) //该任务调用的模块
        .pipe(gulp.dest('./css')); //将会在src/css下生成index.css
});

// 合并，压缩文件
gulp.task('scripts', function() {
    gulp.src('./js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// 默认任务
gulp.task('default', function() {

    // 监听文件变化
    gulp.watch(config['assets'].less, ['less']);
});
