/* eslint-env es6 */
'use strict';

import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import gulp from 'gulp';
import gulpstylelint from 'gulp-stylelint';
import cssnano from 'gulp-cssnano';
import newer from 'gulp-newer';
import pump from 'pump';


// Project paths
const paths = {
	html: {
		src: './development/**/*.html'
	},
	images: {
		src: './development/images/**/**.*',
		dest: './production/images/'
	},
	styles: {
		src: './development/**/*.css'
	},
	scripts: {
		src: './development/**/*.js'
	},
	dest: './production/'
};


/**
 * Set up BrowserSync.
 * https://browsersync.io/
 */

const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './production/',
      open:false
    }
  });
  done();
}


/**
 * HTML copy and paste.
 */
export function html(done) {

	pump([
        gulp.src(paths.html.src),
        newer(paths.dest),
		gulp.dest(paths.dest)
	], done);

}


/**
 * Images copy and paste.
 */
export function images(done) {

	pump([
        gulp.src(paths.images.src),
        newer(paths.images.dest),
		gulp.dest(paths.images.dest)
	], done);

}


/**
 * CSS copy and paste.
 */
export function styles(done) {

	pump([
        gulp.src(paths.styles.src),
		newer(paths.dest),
		// gulpstylelint({
		// 	reporters: [
		// 		{ formatter: 'string', console: true}
		// 	],
		// 	failAfterError: false,
		// 	fix: false
		// }),
		// cssnano(),
		gulp.dest(paths.dest)
	], done);

}


/**
 * JavaScript copy and paste via Babel (support for ES2015).
 * https://babeljs.io/
 */
export function scripts(done) {

	pump([
        gulp.src(paths.scripts.src),
        newer(paths.dest),
		babel(),
		gulp.dest(paths.dest)
	], done);

}


/**
 * Watch everything
 */
export function watch() {
	gulp.watch(paths.html.src, gulp.series(html, reload));
	gulp.watch(paths.images.src, gulp.series(images, reload));
	gulp.watch(paths.styles.src, gulp.series(styles, reload));
	gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
}


/**
 * Map out the sequence of events on first load:
 */
const firstRun = gulp.series(html, images, styles, scripts, serve, watch);


/**
 * Run the whole thing.
 */
export default firstRun;
