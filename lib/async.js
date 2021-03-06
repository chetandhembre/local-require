/**
 * Created by ichetandhembre on 15/4/14.
 */

/*jslint node: true*/

'use strict';

var fs =  require('fs');
var path = require('path');
var async =  require('async');
var common = require('./common');

/**
 * createNodeModule directory
 * @returns {*}
 */
var createNodeModuleDir = function (callback) {
    fs.mkdir(path.resolve(process.cwd(), './node_modules'), callback);
};




/**
 * check if app is registered or not
 * @param nodeModulePath
 * @param appName
 * @param callback
 */
var checkIfNamespacePresent = function (nodeModulePath, appName, callback) {
    fs.exists(path.resolve(nodeModulePath, appName), function (present) {
        callback(null, present);
    });
};


/**
 * create function to create namespce
 * @param path
 * @param callback
 */
var createNameSpace = function (path, callback) {
  fs.mkdir(path, callback);
};

var handleSymlink = function (src, dest, type, callback) {
    fs.exists(dest, function (exist) {
        if (exist) {
            fs.unlinkSync(dest);
        }
        //create symlink
        if (type) {
            fs.symlink(src, dest, type, callback);
        } else {
            fs.symlink(src, dest, callback);
        }

    });
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
var createSymLink = function (namespacePath, basedir, filename, filePath, callback) {
    var childDir = basedir;
    var src = path.resolve(childDir, filePath);
    var dest = path.resolve(namespacePath, filename);
    async.waterfall([
        function (cb) {
            fs.lstat(src, function (err, stat) {
                if (err) {
                    cb(new Error('NOT Found:' + src));
                } else {
                    cb(null, stat);
                }
            });
        }, function (stat, cb) {
            var type = 'file';
            if (stat.isDirectory()) {
                type = 'dir';
            }

            handleSymlink(src, dest, type,function (err, response) {
                cb(err, response);
            });
        }
    ], callback);
};

/**
 * register files
 * opts: object contains followig keys
 * 1) namespace : string
 * 2) basedir : string
 * 3) config : object
 * @param opts
 * @param callback
 */
var register = function (opts, callback) {

  var err1 = common.verifyInput(opts);
  if (err1) {
    callback(new Error(err1));
    return;
  }

  if (!opts.basedir) {
    opts.basedir = process.cwd();
  }

  //check if node_module folder is present or not if absent then send error
  var nodeModulePath = common.getNearestNodeModulePath(opts.basedir);
  if (!nodeModulePath) {
    callback(new Error('unable to find node_modules folder'));
    return;
  }

  var config = opts.config;
  var isnamespaceconflict = false;
  async.waterfall([
    //we will override any install module if it is conflict with namespace
    function (cb) {
      checkIfNamespacePresent(nodeModulePath, opts.namespace, function (err, exists) {
        if (exists) {
          isnamespaceconflict = true;
        }
        cb(null);
      });
    },
    function (cb) {
      if (!isnamespaceconflict) {
        createNameSpace(path.resolve(nodeModulePath, opts.namespace), function (err, result) {
          if (err) {
            cb(err);
          } else {
            cb(null, result);
          }
        });
      } else {
        cb(null, null);
      }
    }, function (result, cb) {
      var keys = Object.keys(config);
      async.eachSeries(keys, function (filename, cb1) {
        var filepath  = config[filename];
        createSymLink(path.resolve(nodeModulePath, opts.namespace),
            opts.basedir, filename, filepath, cb1);
      }, function (err) {
        cb(err);
      });
    }
  ], callback);

};

exports.register = register;
