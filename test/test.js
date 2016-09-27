/*jslint node: true*/
/*global describe, it, expect, beforeEach*/

"use strict";

var assert = require("assert"),
    expect = require("chai").expect,
    taskTime = require("../index");

describe("taskStart", function () {
    taskTime.showTotalTimeLog = false;

    it("Adds 1 to 'taskTime.tasksRunning'", function () {
        taskTime.taskStart();

        expect(taskTime.tasksRunning).to.equal(1);
    });
});

describe("taskStop", function () {
    beforeEach(function (done) {
        taskTime.taskStop();

        setTimeout(function () {
            done();
        }, 10);
    });

    it("Removes 1 from 'taskTime.tasksRunning'", function () {
        expect(taskTime.tasksRunning).to.equal(0);
        taskTime.showTotalTimeLog = true;
    });
});