/**
 * Created by ichetandhembre on 19/4/14.
 */
/*jslint node:true */

'use strict';

var path = require('path');
var fs = require('fs');


/**
 * return parent directory path of path provided
 * @param path
 * @returns {*}
 */
var getParentDirectory = function (dirPath) {
    return path.resolve(dirPath, '../');
};


var getNearestNodeModulePath = function (basedir) {
    var childDir = basedir;
    var home = getUserHome();
    var newPath = path.resolve(childDir, './node_modules');
    var nodeModulePath;
    do {
        nodeModulePath = newPath;
        if (fs.existsSync(nodeModulePath) && fs.statSync(nodeModulePath).isDirectory()) {
            return nodeModulePath;
        }
        childDir = getParentDirectory(childDir);
        newPath = path.resolve(childDir, './node_modules');
    } while (home !== nodeModulePath);
    return undefined;
};



/**
 * return home directory of user
 * @returns {*}
 */
var getUserHome = function () {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
};



var verifyInput = function (opts) {
    if (typeof opts !== 'object') {
        return '1st argument should be object';
    }

    if (typeof opts.namespace !== 'string') {
        return 'namespace should be string';
    }

    if (typeof opts.config !== 'object') {
        return 'configuration should be an object';
    }
};

exports.getNearestNodeModulePath = getNearestNodeModulePath;
exports.verifyInput = verifyInput;
exports.getUserHome = getUserHome;
exports.getParentDirectory = getParentDirectory;