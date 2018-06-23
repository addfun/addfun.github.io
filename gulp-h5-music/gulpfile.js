var gulp = require('gulp')
var imageMin = require('gulp-imagemin')
var htmlClean = require('gulp-htmlclean')
var uglify = require('gulp-uglify')
var stripDebug = require('gulp-strip-debug')
var concat = require('gulp-concat')
var deporder = require('gulp-deporder')//优先级依赖
var less = require('gulp-less')
var postcss = require('gulp-postcss')//处理css 自动补全 压缩。。。
var autoprefixer = require('autoprefixer')//自动补全
var cssnano = require('cssnano')//压缩
var connect = require('gulp-connect')

var folder = {
    src : 'src/',
    dist : 'dist/'
}

var devMode = process.env.NODE_ENV === 'production';//判断是否为生产环境

gulp.task('html', function(){
    var page = gulp.src(folder.src + 'html/*')
                   .pipe(connect.reload())
    if(devMode){
        page.pipe(htmlClean())
    }
    page.pipe(gulp.dest(folder.dist + 'html/'))    
})

gulp.task('images',function(){
    gulp.src(folder.src + 'img/*')
        .pipe(connect.reload())    
        .pipe(imageMin())
        .pipe(gulp.dest(folder.dist + 'images/'))
})

gulp.task('js', function(){
    var js = gulp.src(folder.src + 'js/*')
                 .pipe(connect.reload())
                 .pipe(deporder())
                 .pipe(concat('main.js'))
    if(devMode){
        js.pipe(uglify())
          .pipe(stripDebug()) 
    }
    js.pipe(gulp.dest(folder.dist + 'js/'))
})

gulp.task('css', function(){
    var css = gulp.src(folder.src + 'css/*')
                  .pipe(connect.reload())
                  .pipe(less());
    var options = [autoprefixer()];
    if(devMode){
        options.push(cssnano())
    }
    css.pipe(postcss(options))
       .pipe(gulp.dest(folder.dist + 'css/'))
})

gulp.task('watch', function(){
    gulp.watch(folder.src + 'html/*', ['html']);
    gulp.watch(folder.src + 'js/*', ['js']);
    gulp.watch(folder.src + 'css/*', ['css']);
    gulp.watch(folder.src + 'img/*', ['images']);
})

gulp.task('server', function(){
    connect.server({
        port: '8081',
        livereload: true
    });
})

gulp.task('default', ['html', 'images', 'js', 'css', 'watch', 'server'])