coffee = require "gulp-coffee"
del = require "del"
gulp = require "gulp"
gutil = require "gulp-util"

cleanDestination = -> del "*js"
cleanNPMDebug = -> del "npm-debug.log"
clean = gulp.parallel cleanDestination, cleanNPMDebug

build = ->
  gulp.src "src/*.coffee"
    .pipe coffee bare: yes
    .pipe gulp.dest "."

rebuild = gulp.series clean, build

gulp.task "default", rebuild
gulp.task "clean", clean
gulp.task "build", build
gulp.task "rebuild", rebuild
