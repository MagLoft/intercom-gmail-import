import fs from "fs"
import gulp from "gulp"
import sourcemaps from "gulp-sourcemaps"
import buffer from "gulp-buffer"
import uglify from "gulp-uglify"
import tap from "gulp-tap"
import clean from "gulp-clean"
import browserify from "browserify"
import babel from "babelify"
import eslint from "gulp-eslint"
import injectVersion from "gulp-inject-version"
import zip from "gulp-zip"
import crx from "gulp-crx-pack"

gulp.task("clean", () => gulp.src(["dist/*.js", "dist/*.js.map"], { read: false })
    .pipe(clean()))

gulp.task("build", ["clean"], () => gulp.src("./src/*.js", { read: false })
    .pipe(tap((file) => {
      file.contents = browserify(file.path, { debug: true })
      .transform(babel, { presets: ["es2015"] })
      .bundle()
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./dist/")))

gulp.task("manifest", () => gulp.src("./src/manifest.json")
    .pipe(injectVersion({ prepend: "" }))
    .pipe(gulp.dest("./dist/")))

gulp.task("dist", ["clean", "manifest"], () => gulp.src("./src/*.js", { read: false })
    .pipe(tap((file) => {
      file.contents = browserify(file.path, { debug: false })
      .transform(babel, { presets: ["es2015"] })
      .bundle()
    }))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("./dist/")))

gulp.task("watch", () => {
  gulp.watch("./src/**/*.js", ["build"])
})

gulp.task("lint", () => gulp.src("./src/**/*.js")
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()))

gulp.task("zip", ["dist"], () => gulp.src(["./dist/**/*", "./certs/key.pem"])
    .pipe(zip("intercom-gmail-import.zip"))
    .pipe(gulp.dest("./")))

gulp.task("crx", ["dist"], () => gulp.src("./dist/")
    .pipe(crx({
      privateKey: fs.readFileSync("./certs/key.pem", "utf8"),
      filename: "intercom-gmail-import.crx"
    }))
    .pipe(gulp.dest("./")))

gulp.task("default", ["build", "watch"])
