/**
 * Created by ichetandhembre on 15/4/14.
 */

/*jslint node: true*/

'use strict';

var fs =  require('fs');
var parentPath = require('parentpath');
var path = require('path');


/**
 * createNodeModule directory
 * @returns {*}
 */
var createNodeModuleDir = function (callback) {
    fs.mkdir(path.resolve(process.cwd(), './node_modules'), callback);
};


var getNearestNodeModulePath = function () {
    var childDir = process.cwd();
    var home = getUserHome();
    var newPath = path.resolve(childDir,'./node_modules');
    var nodeModulePath;
    do {
        nodeModulePath = newPath;
        if (fs.existsSync(nodeModulePath) && fs.statSync(nodeModulePath).isDirectory()) {
            return nodeModulePath;
        }
        childDir = getParentDirectory(childDir);
        newPath = path.resolve(childDir,'./node_modules');
    } while (home !== nodeModulePath);
    return undefined;
};

/**
 * return parent directory path of path provided
 * @param path
 * @returns {*}
 */
var getParentDirectory = function (dirPath) {
    return path.resolve(dirPath, '../');
};


/**
 * return home directory of user
 * @returns {*}
 */
var getUserHome = function () {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
};


/**
 * use to
 * @param registerMap
 * @param callback
 */
var register = function (registerMap, callback) {
    if (typeof registerMap !== 'object') {
        if (callback) {
            callback('1st argument should be object');
        }
        return;
    }

    var nodeModulePath = getNearestNodeModulePath();


};

/**
 * check if app is registered or not
 * @param nodeModulePath
 * @param appName
 * @param callback
 */
var checkIfAppRegistered = function(nodeModulePath, appName, callback) {
    fs.exists(path.resolve(nodeModulePath, appName), function(presnet) {
        callback(null, presnet);
    });
};

/**
 * register app
 * @param app
 * @param callback
 */
var registerApp = function (app, callback) {
    if (typeof app !== 'string') {
        if (callback) {
            callback('app name should be string');
        }
        return;
    }

    var nodeModulePath = getNearestNodeModulePath();


    if (!nodeModulePath) {
        createNodeModuleDir(function (err, response) {
            if (err) {
                callback(err);
            }
        });
    }

    checkIfAppRegistered(nodeModulePath, app, function (err, present) {
        if (err || present) {
            callback('app name is already present');
        } else {
            fs.mkdir(path.resolve(nodeModulePath, app), function (err, response) {
                if (err) {
                    callback(err);
                } else {
                    //do stuff
                }
            });
        }
    });


};

exports.registerApp = registerApp;

exports.register = register;

