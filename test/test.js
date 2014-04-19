/**
 * Created by ichetandhembre on 15/4/14.
 */

/*jslint node: true*/

'use strict';

var lRequire =  require('../');
var test =  require('tap').test;

test('1st argument should be string', function (t) {

    lRequire.register({}, {}, function (err, response) {
        t.equal(err.message, 'namespace should be string', '1st argument should be string');
        t.end();
    });
});

test('configuration should be object', function (t) {
    lRequire.register('demo', 'demo', function (err, response) {
        t.equal(err.message, 'configuration should be an object', 'configuration should be an object');
        t.end();
    });
});

test('namespace is already present', function (t) {
    lRequire.register('tap', {}, function (err, response) {
        t.equal(err.message, 'namespace already present', 'namespace already present');
        t.end();
    });
});
//
//test('config file path is not specified', function (t) {
//    lRequire.register('demo', {
//        "1" : "../node_modules/1.js"
//    }, function (err, response) {
//        t.equal(err.message, 'namespace already present', 'namespace already present');
//        t.end();
//    });
//});
