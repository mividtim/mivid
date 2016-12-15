coffee = require "gulp-coffee"
del = require "del"
gulp = require "gulp"
gutil = require "gulp-util"
sourcemaps = require "gulp-sourcemaps"

cleanDestination = -> del "dist"
cleanNPMDebug = -> del "npm-debug.log"
clean = gulp.parallel cleanDestination, cleanNPMDebug

build = ->
  gulp.src "src/*.coffee"
    .pipe sourcemaps.init loadMaps: yes
    .pipe coffee bare: yes
    .pipe sourcemaps.write "."
    .pipe gulp.dest "dist"

rebuild = gulp.series clean, build

gulp.task "default", rebuild
gulp.task "clean", clean
gulp.task "build", build
gulp.task "rebuild", rebuild
