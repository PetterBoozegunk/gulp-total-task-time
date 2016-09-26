/*jslint node: true*/

"use strict";

var gulp = require('gulp'),
    chalk = require('chalk'),

    taskTime = {
        tasksRunning: 0,
        formatTime: function (hmsms) { // hmsms = Hours (or) Minutes (or) Seconds (or) MilliSeconds
            var hmsmsStr = hmsms.toString();

            return (hmsms < 10) ? "0" + hmsmsStr : hmsmsStr;
        },
        getHours: function (duration) {
            var h = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

            return h ? taskTime.formatTime(h) : '00';
        },
        getMinutes: function (duration) {
            var m = parseInt((duration / (1000 * 60)) % 60, 10);

            return ':' + (m ? taskTime.formatTime(m) : '00');
        },
        getSeconds: function (duration) {
            var s = parseInt((duration / 1000) % 60, 10);

            return ':' + (s ? taskTime.formatTime(s) : '00');
        },
        getMilliSeconds: function (duration) {
            var ms = parseInt((duration % 1000) / 100, 10);

            return ':' + (ms ? ms.toString() : '000');
        },
        addTimeToString: function (timeStr, prettyTimeStr) {
            if (timeStr) {
                prettyTimeStr = prettyTimeStr + timeStr;
            }

            return prettyTimeStr;
        },
        formatSecondsMilliseconds: function (noZeros, ms) {
            if (ms) {
                noZeros = noZeros.replace(/(\d+)(s)(\s\d+ms)/, "$1." + ms.join().replace(/ms$/, "s"));
            }

            noZeros = noZeros.replace(/\s0s$/, "");
            noZeros = noZeros.replace(/(^0\.)(0+)?([\d]+)(s$)/, "$3ms");
            noZeros = noZeros.replace(/(\.)(0+)?([1-9]+)?(0+)(s$)/, "$1$2$3$5");

            return noZeros.replace(/(^0)!(\w)/, "");
        },
        removeZeros: function (prettyTimeStr) {
            var ms = prettyTimeStr.match(/\d+ms$/g),
                noZeros = prettyTimeStr.replace(/(^|\s)0/g, '$1');

            return taskTime.formatSecondsMilliseconds(noZeros, ms);
        },
        checkAddToPrettyTimeStr: function (str, time, index) {
            return (!/^0{2,3}$/.test(str) || time[index] === "s");
        },
        addToPrettyTimeStr: function (str, time, index, newPrettyStr) {
            if (taskTime.checkAddToPrettyTimeStr(str, time, index)) {
                newPrettyStr += str + time[index] + ' ';
            }

            return newPrettyStr;
        },
        formatPrettyTime: function (prettyTimeStr) {
            var time = ['h', 'm', 's', 'ms'],
                newPrettyStr = '';

            prettyTimeStr.split(':').forEach(function (str, index) {
                newPrettyStr = taskTime.addToPrettyTimeStr(str, time, index, newPrettyStr);
            });

            return taskTime.removeZeros(newPrettyStr.trim());
        },
        getPrettyTime: function () {
            var args = arguments,
                prettyTimeStr = '';

            Object.keys(args).forEach(function (index) {
                prettyTimeStr = taskTime.addTimeToString(args[index], prettyTimeStr);
            });

            return taskTime.formatPrettyTime(prettyTimeStr);
        },
        getDuration: function (duration) {
            var hours = taskTime.getHours(duration),
                minutes = taskTime.getMinutes(duration),
                seconds = taskTime.getSeconds(duration),
                milliseconds = taskTime.getMilliSeconds(duration);

            return taskTime.getPrettyTime(hours, minutes, seconds, milliseconds);
        },
        logEnd: function () {
            var duration = Math.round((taskTime.end[0] * 1000) + (taskTime.end[1] / 1000000));

            console.log(chalk.magenta('Total ' + taskTime.getDuration(duration)));
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
        }
    },
    testsObj = {
        tests: [{
            input: ['00', ':00', ':00', ':000'],
            expect: "0s"
        }, {
            input: ['01', ':00', ':00', ':000'],
            expect: "1h"
        }, {
            input: ['00', ':01', ':00', ':000'],
            expect: "1m"
        }, {
            input: ['00', ':00', ':01', ':000'],
            expect: "1s"
        }, {
            input: ['00', ':00', ':00', ':001'],
            expect: "1ms"
        }, {
            input: ['00', ':01', ':01', ':000'],
            expect: "1m 1s"
        }, {
            input: ['00', ':00', ':00', ':859'],
            expect: "859ms"
        }, {
            input: ['00', ':00', ':14', ':300'],
            expect: "14.3s"
        }, {
            input: ['00', ':10', ':09', ':000'],
            expect: "10m 9s"
        }, {
            input: ['00', ':00', ':00', ':010'],
            expect: "10ms"
        }, {
            input: ['00', ':00', ':02', ':037'],
            expect: "2.037s"
        }, {
            input: ['00', ':00', ':15', ':002'],
            expect: "15.002s"
        }, {
            input: ['10', ':08', ':09', ':007'],
            expect: "10h 8m 9.007s"
        }, {
            input: ['09', ':18', ':00', ':010'],
            expect: "9h 18m 0.01s"
        }, {
            input: ['00', ':00', ':00', ':044'],
            expect: "44ms"
        }],
        pass: function (message, test) {
            console.log(chalk.green('PASS: input = ' + message + ' => ' + test));
        },
        fail: function (message, expect, saw) {
            var failMessage = 'FAIL: input = ' + message + ' expected ' + expect + ' saw ' + saw;

            throw new Error(chalk.red(failMessage));
        },
        runTests: function () {
            testsObj.tests.forEach(function (testObj) {
                var test = taskTime.getPrettyTime.apply(this, testObj.input);

                if (test === testObj.expect) {
                    testsObj.pass(testObj.input.join().replace(/,/g, ''), test);
                } else {
                    testsObj.fail(testObj.input.join().replace(/,/g, ''), testObj.expect, test);
                }
            });
        }
    };

gulp.on('task_start', taskTime.taskStart);
gulp.on('task_stop', taskTime.taskStop);

module.exports = testsObj.runTests;