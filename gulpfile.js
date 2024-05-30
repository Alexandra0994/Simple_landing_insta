
const gulp = require("gulp");
const concat = require("gulp-concat");
const gulpClean = require("gulp-clean");
const cssmin = require("gulp-cssmin");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const minify = require("gulp-minify");
const imagemin = require("gulp-imagemin");
const {series,parallel} = require("gulp");
// cleaning 
const clean = () => {
    return gulp.src("dist/").
        pipe(gulpClean());
}

// scss => css => min => rename
const minCss = function () {
    return gulp.src("src/scss/*.scss").
    pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError)).
    pipe(autoprefixer()).
    pipe(concat("all.css")).
    pipe(cssmin()).
    pipe(rename({ suffix: '.min' })).
    pipe(gulp.dest("dist/style")).
    pipe(browserSync.stream());
}
// compound => minjs
const minJs = function () {
    return gulp.src("src/js/*.js")
        .pipe(concat("all.js"))
        .pipe(minify())
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
}
// imagemin
const minImg = function () {
    return gulp.src('src/img/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.stream());
};
// reload
const browsersync = function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
}

// watch
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("index.html").on("change", browserSync.reload)
    gulp.watch("src/scss/*.scss", minCss)
    gulp.watch("src/js/*.js", minJs)
    gulp.watch("src/img/*.*", minImg)
}
gulp.task("cleaning", clean);
gulp.task("watch", watch);
gulp.task("minCs", minCss);
gulp.task("minJ", minJs)
gulp.task("minImg", minImg);
gulp.task('browser-sync', browsersync);

gulp.task('dev', gulp.series(
	clean,									// delete smelly old "src/index.html".									// then create fresh new "src/index.html" from pieces inside the "./src/index/" subfolder									// then kill the destination folder.
	gulp.parallel(minCss, minJs, minImg),		// then do all these tasks in parallel.								// delete "src/index.html" again (to avoid confusion).
	gulp.parallel( watch)					// then run the local web server and start watching the files for changes.
));

//exports.default = series(clean, gulp.parallel(minCss, minJs, minImg));
//exports.dev = series(clean, minCss, minJs, minImg ,watch);

//додати команду в package.json => в scripts  "dev": "gulp dev"



//npm run dev