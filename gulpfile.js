var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("default", function() {
    gulp.src("index.js")
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest("compat"));
});
