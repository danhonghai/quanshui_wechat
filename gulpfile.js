//依赖库
var fs = require("fs");
var path = require("path");

//引入gulp
var gulp = require('gulp');

//引入组件
var htmlmin = require('gulp-htmlmin'); //html压缩
var imagemin = require('gulp-imagemin'); //图片压缩
var pngcrush = require('imagemin-pngcrush'); //确保本地已安装imagemin-pngquant [npm install imagemin-pngquant --save-dev]
var minifycss = require('gulp-minify-css'); //css压缩
var jshint = require('gulp-jshint'); //js检测
var uglify = require('gulp-uglify'); //js压缩
var concat = require('gulp-concat'); //文件合并
var less = require('gulp-less'); //提示信息
var rev = require('gulp-rev'); //版本号生成
var revCollector = require('gulp-rev-collector'); //版本收集修改
var cheerio = require('gulp-cheerio'); //html文档操作


// 检查js
gulp.task('lint', function () {
	gulp.src(['www/js/*/*.js', 'www/js/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});
gulp.task('revjs', function () {
	gulp.src('www/js/*.js')
		.pipe(rev())
		.pipe(gulp.dest('build/js'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/appjs'))
		.on("end", function () {
			gulp.run("html");
		});
});
//复制font
gulp.task('copyfont', function () {
	gulp.src('www/fonts/*')
		.pipe(gulp.dest('build/fonts'))
		.on("end", function () {
			gulp.run("copyimg");
		});
});
//复制img
gulp.task('copyimg', function () {
	gulp.src('www/img/*')
		.pipe(gulp.dest('build/img'))
		.on("end", function () {
			gulp.run("copyjson");
		});
});
//复制json
gulp.task('copyjson', function () {
	gulp.src('www/json/*')
		.pipe(gulp.dest('build/json'))
		.on("end", function () {
			gulp.run("copylib");
		});
});
//复制lib
gulp.task('copylib', function () {
	gulp.src(['www/lib/*', 'www/lib/*/*', 'www/lib/*/*/*', 'www/lib/*/*/*/*'])
		.pipe(gulp.dest('build/lib'))
		.on("end", function () {
			gulp.run("copyhtml");
		});
});
// 合并、压缩js文件
gulp.task('js', function () {
	gulp.src(['www/js/*/*.js'])
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(rev())
		.pipe(gulp.dest('build/js'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/js'))
		.on("end", function () {
			gulp.run("revjs");
		});
});

// 图片加版本号
gulp.task('img', function () {
		gulp.src('www/images/*')
		.pipe(rev())
		.pipe(gulp.dest('build/images'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/images'))
		.on("end", function () {
			gulp.run("css");
		})
});
// 压缩图片
gulp.task('revimg', function () {
	gulp.src('build/images/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngcrush()]
		}))
		.pipe(gulp.dest('build/images'));
});

//css版本号处理
gulp.task('cssEnd', function () {
	gulp.src(['rev/*/*.json', 'build/css/*.css'])
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(gulp.dest('build/css'))
		.on("end", function () {
			gulp.run("js");
		});
});
// 合并、压缩、重命名css
gulp.task('css', function () {
	gulp.src('www/less/*.less')
		.pipe(less())
		.pipe(concat('ui.css'))
		.pipe(minifycss())
		.pipe(rev())
		.pipe(gulp.dest('build/css'))
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/css'))
		.on("end", function () {
			gulp.run("cssEnd");
		});
});
//复制html
gulp.task('copyhtml', function () {
	gulp.src(['www/templates/*/*','www/templates/*'])
		.pipe(gulp.dest('build/templates'))
		.on("end", function () {
			gulp.run("img");
		});
});
//html版本号处理
gulp.task('htmlEnd', function () {
	gulp.src(['rev/*/*.json', 'build/index.html'])
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(gulp.dest('build'))
		.on("end", function () {
			gulp.run("htmlimgEnd");
		});
});
//html里面的图片版本号处理
gulp.task('htmlimgEnd', function () {
	gulp.src(['rev/images/*.json', 'build/templates/*/*'])
		.pipe(revCollector({
			replaceReved: true
		}))
		.pipe(gulp.dest('build/templates'))
		.on("end", function () {
			gulp.run("revimg");
		});
});

// 压缩html
gulp.task('html', function () {
	gulp.src('www/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('www'));

	gulp.src('www/*.html')
		.pipe(cheerio(function ($) {
			$('script').remove();
			$('link').remove();
			$('head').append('<link href="lib/ionic/css/ionic.min.css" rel="stylesheet">');
			$('head').append('<link href="lib/swiper/swiper.min.css" rel="stylesheet">');
			$('head').append('<link href="lib/mobiscroll/css/mobiscroll.animation.css" rel="stylesheet">');
			$('head').append('<link href="lib/mobiscroll/css/mobiscroll.frame.css" rel="stylesheet">');
			$('head').append('<link href="css/ui.css" rel="stylesheet">');
			$('head').append('<link href="lib/mobiscroll/css/mobiscroll.frame.ios.css" rel="stylesheet">');
			$('head').append('<link href="lib/mobiscroll/css/mobiscroll.scroller.css" rel="stylesheet">');
			$('head').append('<link href="lib/mobiscroll/css/mobiscroll.scroller.ios.css" rel="stylesheet">');
			$('body').append('<script src="lib/ionic/js/ionic.bundle.min.js"></script>');
			$('body').append('<script src="lib/jquery.min.js"></script>');
			$('body').append('<script src="lib/swiper/swiper.min.js"></script>');
			$('body').append('<script src="lib/radialIndicator.js"></script>');
			$('body').append('<script src="lib/jquery.scs.min.js"></script>');
			$('body').append('<script src="lib/CNAddrArr.min.js"></script>');
			$('body').append('<script src="lib/mobiscroll/js/mobiscroll.dom.js"></script>');
			$('body').append('<script src="lib/mobiscroll/js/mobiscroll.core.js"></script>');
			$('body').append('<script src="lib/mobiscroll/js/mobiscroll.scrollview.js"></script>');
			$('body').append('<script src="lib/mobiscroll/js/mobiscroll.frame.js"></script>');
			$('body').append('<script src="lib/mobiscroll/js/mobiscroll.frame.ios.js"></script>');
			$('body').append('<script src="lib/mobiscroll/js/mobiscroll.scroller.js"></script>');
			$('body').append('<script src="lib/mobiscroll/js/mobiscroll.i18n.zh.js"></script>');
			$('body').append('<script src="js/all.js"></script>');
			$('body').append('<script src="js/app.js"></script>');
		}))
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('build'))
		.on("end", function () {
			gulp.run("htmlEnd");
		});
});
//开发任务
gulp.task('watch', function () {
	//Watch .html files
	// gulp.watch('www/*.html', ['kfhtml']);
	// Watch .css files
	gulp.watch('www/less/*.less', ['kfcss']);
	// Watch .js files
	// gulp.watch('www/js/*/*.js', ['js']);
	// Watch .js files
	// gulp.watch('www/js/*.js', ['copyjs']);
});
// 开发任务合并、压缩、重命名css
gulp.task('kfcss', function () {
	gulp.src('www/less/*.less')
		.pipe(less())
		.pipe(concat('ui.css'))
		.pipe(minifycss())
		.pipe(gulp.dest('www/css'));
});
//定义默认任务
gulp.task('default', function () {
    gulp.run('copyfont');
});
//定义默认开发任务
gulp.task('debug', function () {
	gulp.run('kfcss', 'watch');
});
