/*jslint node: true*/

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
    taskTime = require("./index");

cccp(cccpConfig);
taskTime.init();

gulp.task("default", function () {
    console.log("This default task is basiclly a test that should take a loooong time to finish");

    return gulp.src("**/*.js")
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});