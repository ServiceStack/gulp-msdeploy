var gulp = require('gulp'),
    nodeunit = require('gulp-nodeunit');
var msdeploy = require('./index.js');
var path = require('path');

gulp.task('default', function () {
    gulp.src('tests.js')
        .pipe(nodeunit({
            reporter: 'junit',
            reporterOptions: {
                output: 'test'
            }
        }));
});

gulp.task('example', function () {
    gulp.src('test/')
        .pipe(msdeploy({
            verb: 'sync',
            sourceType: 'iisApp',
            dest: {
                'package': path.resolve('./webdeploy.zip')
            }
        }));

});