/*jslint node: true*/

(function () {
    "use strict";

    var gulp = require("gulp"),
        cccp = require("gulp-cccp"),
        cccpConfig = {
            platoDir: "./report",
            checkFixSrc: [
                "**/*.js",
                "**/*.json",
                "!node_modules/**",
                "!report/**"
            ],
            complexityCheck: ["*.js"]
        },
        gulpTotalTaskTimeTests = require("./index");

    cccp(cccpConfig);

    gulp.task("default", function () {
        gulpTotalTaskTimeTests();

        return gulp.src("**/index.js")
            .pipe(gulp.dest(function (file) {
                return file.base;
            }));
    });
}());