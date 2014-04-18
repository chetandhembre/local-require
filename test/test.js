/**
 * Created by ichetandhembre on 15/4/14.
 */

/*jslint node: true*/

'use strict';

var lRequire =  require('../');
var test =  require('tap').test;

test('register', function (t) {
    lRequire.register("demo", function (err, response) {
        t.equal(err, '1st argument should be object', 'first argument should be json');
        t.end();
    });
});

test('registerApp', function (t) {
    lRequire.registerApp({}, function (err, response) {
        t.equal(err, 'app name should be string', 'first argument should be string');
        t.end();
    });
});

test('registerApp-present', function (t) {
    lRequire.registerApp('tap', function (err, response) {
        t.equal(err, 'app name is already present', 'app name and module name should not conflict');
        t.end();
    });
});