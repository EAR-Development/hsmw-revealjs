const yargs = require('yargs')

const gulp = require('gulp')
const sass = require('gulp-sass')
const connect = require('gulp-connect')

const root = yargs.argv.root || '.'
const port = yargs.argv.port || 8000

gulp.task('css-themes', () => gulp.src(['./hsmw-theme/source/*.{sass,scss}'])
        .pipe(sass())
        .pipe(gulp.dest('./hsmw-theme')))

gulp.task('reload', () => gulp.src(['*.html', '*.md'])
    .pipe(connect.reload()));

gulp.task('serve', () => {

    connect.server({
        root: root,
        port: port,
        host: '0.0.0.0',
        livereload: true
    })

})