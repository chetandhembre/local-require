/**
 * Created by ichetandhembre on 19/4/14.
 */

/*jslint node: true*/

'use strict';

var fs =  require('fs');
var path = require('path');
var common = require('./common');


/**
 * check if app is registered or not
 * @param nodeModulePath
 * @param appName
 * @param callback
 */
var checkIfNamespacePresentSync = function (nodeModulePath, appName, callback) {
    return fs.existsSync(path.resolve(nodeModulePath, appName));
};

/**
 * create function to create namespce
 * @param path
 * @param callback
 */
var createNameSpaceSync = function (path, callback) {
    fs.mkdirSync(path);
};

var handleSymlinkSync = function (src, dest, type) {

    if (fs.exists(dest)) {
        throw new Error('file already register at:' + dest);
    }

    if(type) {
        fs.symlinkSync(src, dest, type);
    } else {
        fs.symlinkSync(src, dest);
    }
};


/**
 * this function create sublink of file in namespace folder
 * following is algo for it
 * 1) check if filepath is exists or not
 * 2) check if filename or dirname is present in namespace or not if not then throw exception
 * 3) if yes then see whether it is directory or file
 * 4) if it is file then create symlink in namespace directory
 * 5) if it is directory then check for index file in directory if not present then throw exception
 * 6) if index.js present then create symlink of index.js with name of directory
 * @param namespacePath
 * @param filePath
 * @param callback
 */
var createSymLinkSync = function (namespacePath, basedir, filename, filePath) {
    var childDir = basedir;
    var src = path.resolve(childDir, filePath);
    var dest = path.resolve(namespacePath, filename);
    var stats = fs.statSync(src);
    var type = 'file';
    if (stats.isDirectory()) {
        type = 'dir';
    }

    handleSymlinkSync(src, dest, type);
};

/**
 * register files
 * opts: object contains followig keys
 * 1) namespace : string
 * 2) basedir : string
 * 3) config : object
 * @param opts
 */
var registerSync = function (opts) {

    var err1 = common.verifyInput(opts);
    if (err1) {
        throw new Error(err1);
    }

    if (!opts.basedir) {
        opts.basedir = process.cwd();
    }

    var nodeModulePath = common.getNearestNodeModulePath(opts.basedir);

    if (checkIfNamespacePresentSync(nodeModulePath, opts.namespace)) {
        throw new Error('namespace already present');
    }

    createNameSpaceSync(path.resolve(nodeModulePath, opts.namespace));

    var config = opts.config;

    var filename;
    for (filename in config) {
        var filepath  = config[filename];
        createSymLinkSync(path.resolve(nodeModulePath, opts.namespace), opts.basedir, filename, filepath);
    }

};
exports.registerSync = registerSync;


