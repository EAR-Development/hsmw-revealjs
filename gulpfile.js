const yargs = require('yargs')

const gulp = require('gulp')
const sass = require('gulp-sass')
const connect = require('gulp-connect')

const shell = require('gulp-shell')

const root = yargs.argv.root || '.'
const port = yargs.argv.port || 8000

gulp.task('css-themes', () => gulp.src(['./hsmw-theme/source/*.{sass,scss}'])
        .pipe(sass())
        .pipe(gulp.dest('./hsmw-theme')))

gulp.task('reload', () => gulp.src(['**/*.html', '**/*.md'])
    .pipe(connect.reload()));

gulp.task('serve', () => {
    connect.server({
        root: root,
        port: port,
        host: '0.0.0.0',
        livereload: true
    })

    gulp.watch(['**/*.html', '**/*.md'], gulp.series('reload'))
    
    gulp.watch([
        './hsmw-theme/source/*.{sass,scss}',
    ], gulp.series('css-themes', 'reload'))
})

gulp.task('pdf', () => {
    connect.server({
        root: root,
        port: port,
        host: '0.0.0.0',
    })

    return gulp
    .src('index.html', {'read':false})
    .pipe(shell(['decktape http://0.0.0.0:'+port+' output.pdf']))
    .on('end', () => connect.serverClose())
})