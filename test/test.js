/**
 * Created by ichetandhembre on 15/4/14.
 */

/*jslint node: true*/

'use strict';


var test =  require('tap').test;




/*
* thing to test
* 1) sync api and async api
* following things should be tested properly
* i) argument should be in proper format
* ii)
*
*
* */

test('test async api', function (t) {
  t.plan(8);
  var lRequire =  require('../');
  t.ok(lRequire, 'local-require module loaded successfully');
  t.test('1st argument should be object', function (t1) {
    lRequire.register('demo', function (err, response) {
      t1.equal(err.message, '1st argument should be object');
      t1.end();
    });
  });

  t.test('namespace should be present', function (t) {
    lRequire.register({}, function (err, response) {
      t.equal(err.message, 'namespace should be string');
      t.end();
    });
  });

  t.test('namespace should be string', function (t) {
    lRequire.register({
      namespace : {}
    }, function (err, response) {
      t.equal(err.message, 'namespace should be string');
      t.end();
    });
  });

  t.test('config should be present', function (t) {
    lRequire.register({
      namespace : 'demo'
    }, function (err, response) {
      t.equal(err.message, 'configuration should be an object');
      t.end();
    });
  });

  t.test('config should be object', function (t) {
    lRequire.register({
      namespace : 'demo',
      config : 'demo'
    }, function (err, response) {
      t.equal(err.message, 'configuration should be an object');
      t.end();
    });
  });

  t.test('node_modules folder is not found', function (t) {
    var home = process.cwd();
    process.chdir('/home');
    lRequire.register({
      namespace : 'demo',
      config : {}
    }, function (err, response) {
      t.equal(err.message, 'unable to find node_modules folder');
      t.end();
      process.chdir(home);
    });
  });

  t.test('node_modules folder is not found', function (t) {
    lRequire.register({
      namespace : 'demo',
      config : {
        '1' : '../1.js'
      }
    }, function (err, response) {
      t.equal(err.message.indexOf('NOT Found'), 0);
      t.end();
    });
  });
});


test('test sync api', function (t) {
  t.plan(8);
  var lRequire =  require('../');
  t.ok(lRequire, 'local-require module loaded successfully');
  t.test('1st argument should be object', function (t1) {
    try {
      lRequire.registerSync('demo');
    } catch (err) {
      t1.equal(err.message, '1st argument should be object');
    }
    t1.end();
  });

  t.test('namespace should be present', function (t) {
    try {
      lRequire.registerSync({});
    } catch (err) {
      t.equal(err.message, 'namespace should be string');
      t.end();
    }
  });

  t.test('namespace should be string', function (t) {
    try {
      lRequire.registerSync({
        namespace : {}
      });
    } catch (err) {
      t.equal(err.message, 'namespace should be string');
      t.end();
    }
  });

  t.test('config should be present', function (t) {
    try {
      lRequire.registerSync({
        namespace : 'demo'
      });
    } catch (err) {
      t.equal(err.message, 'configuration should be an object');
      t.end();
    }
  });

  t.test('config should be object', function (t) {
    try {
      lRequire.registerSync({
        namespace : 'demo',
        config : 'demo'
      });
    } catch (err) {
      t.equal(err.message, 'configuration should be an object');
      t.end();
    }
  });

  t.test('node_modules folder is not found', function (t) {
    var home = process.cwd();
    process.chdir('/home');
    try {
      lRequire.registerSync({
        namespace : 'demo',
        config : {}
      });
    } catch (err) {
      t.equal(err.message, 'unable to find node_modules folder');
      t.end();
    }
    process.chdir(home);
  });

  t.test('src of file is not found', function (t) {
    try {
      lRequire.registerSync({
        namespace : 'demo',
        config : {
          '1' : '../1.js'
        }
      });
    } catch (err) {
      t.equal(err.message.indexOf('ENOENT, no such file or directory'), 0);
      t.end();
    }

  });
});

