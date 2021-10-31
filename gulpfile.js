const gulp = require("gulp");
const imageResize = require("gulp-image-resize");
const parallel = require("concurrent-transform");
const os = require("os");

gulp.task("product-images", function () {
  return gulp
    .src("product-images/**/*.{jpg,png}")
    .pipe(parallel(imageResize({ width: 100 }), os.cpus().length))
    .pipe(gulp.dest("public/img/products"));
});
