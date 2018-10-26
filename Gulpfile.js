var gulp = require('gulp');

var outputDir = 'assets/summernote';

gulp.task('copy-summernote', function() {
	gulp.src('summernote')
		.pipe(gulp.dest(outputDir))
});

gulp.task('copy-plugin', function() {
	gulp.src('dist/uploadfile.js')
		.pipe(gulp.dest(outputDir+'/plugin'))
});

gulp.task('default', ['copy-summernote', 'copy-plugin']);