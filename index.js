/*jslint node: true*/

"use strict";

var gulp = require('gulp'),
    prettyHrtime = require("pretty-hrtime"),
    chalk = require('chalk'),

    taskTime = {
        showTotalTimeLog: true,
        tasksRunning: 0,
        logEnd: function () {
            var totalTime = prettyHrtime(taskTime.end).replace(/(\d)(\s)(h|m|s|ms)($)/, "$1$3$4");

            if (taskTime.showTotalTimeLog) {
                console.log(chalk.magenta('Total ' + totalTime));
            }
        },
        taskStart: function () {
            if (taskTime.tasksRunning === 0) {
                taskTime.start = process.hrtime();
            }

            taskTime.tasksRunning += 1;
        },
        taskStop: function () {
            setTimeout(function () {
                taskTime.tasksRunning -= 1;

                if (taskTime.tasksRunning === 0) {
                    taskTime.end = process.hrtime(taskTime.start);
                    taskTime.logEnd();
                }
            }, 0);
        },
        init: function () {
            gulp.on('task_start', taskTime.taskStart);
            gulp.on('task_stop', taskTime.taskStop);
        }
    };

module.exports = taskTime;