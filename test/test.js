/**
 * Created by ichetandhembre on 15/4/14.
 */

/*jslint node: true*/

'use strict';

var lRequire =  require('../');
var test =  require('tap').test;

test('Test', function (t) {
    lRequire.register("demo", function (err, response) {
        t.equal(err, '1st argument should be object', 'first argument should be json');
        t.end();
    });
});