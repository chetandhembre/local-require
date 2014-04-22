local-require    [![Build Status](https://travis-ci.org/chetandhembre/local-require.svg?branch=master)](https://travis-ci.org/chetandhembre/local-require) [![npm](https://img.shields.io/npm/v/local-require.svg)](https://npmjs.org/package/local-require)
=============

[![NPM](https://nodei.co/npm/local-require.png?downloads=true&stars=true)](https://www.npmjs.org/package/local-require/)

# Problem
  Working in large node.js project usually contain complex and nested directory structure. Directory structure helps in organizing your code but it bring many drawback with that. This module solve one of the drawback, To understand problem lets consider following directory structure

    projecct_name
    |
    |-foo
    |  |-foo1
    |  |   |-f1.js
    |  |-f.js
    |     
    |-bar
    |  |-bar1
    |  |  |-b1.js
    |  |-b.js
    |
    |_server.js

many time we endup requiring ``f.js`` and ``f1.js`` in ``b1.js`` (may be it is result of bad programming but this is not point). Given nature of ``node.js`` we will be doing somethign like ``require('../../foo/foo1/f1.js')``. Problem with this is require statement is solely depend on directory structure if position of ``f1.js`` changes then above ``require`` method wont work. and if we are requiring ``f1.js`` from various part of code then we have to give relative path from module. which might be painful.

# Solution
  My solution is simple it uses awesomeness of ``require``. node.js find modules in particular fashion algorithm is explain in [doc](http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders). Given the nature of algorithm any thing in ``node_modules`` folder can access without relative path. So at start of your ``server`` (usually in ``server.js``) just create ``symboliclink`` to your local files in ``node_module`` folder then you can access these local file without relative path from anywhere in codebase. But all symbolic link in ``node_modules`` folder wont look nice and it will hard to maintain. So why not create directory for these symbolicslink of local files and access them by ``directory_name/file_name``.
  
  
# Installation 
  ``npm install local-require``
  
# Test
   ``npm test``
   
# Api
``local-require`` module provides ``nonblocking`` api. 
   
    var lrequire = require('local-require');
    lrequire.register(opts, function (err) {
      if (err) {
          //problem in creating symlink
      } else {
          //ready to use awesomeness of local-require
      }
    });
    
Or you can also use ``blocking`` api

    var lrequire = require('local-require')
    lrequire.registerSync(opts);

as any nice blocking api this will throws an exception if any thing went wrong.

where ``opts`` is
  
    {
      namespace: 'demo',     //required, directory in which you want to add all symlink
      basedir  : __direname  //optional, directory from which function called default : process.cwd()
      config   : {             
         'f1' : './foo/foo1/f1/js',
         'bar1': './bar/bar1' 
      }                     //requied , it is an object in which name and location mapping done 
    }
    

So  you can add ``f1.js`` from any part of codebase by  ``require('demo/f1')``. We can also use this method to include ``directory`` by ``require('demo/bar1')`` 

Use of ``namespace`` here is just to segregate symboliclink files which will lead to maintanance.You can create any number of namespace just avoid conlicting name with previous namespace or install module name

# ToDo
  - if you have use same namespace more than once last namespace options will override, which also means it will override any install package who has same name as your ``namespace`` we can handle these condition more civilized way.
  
 
# Contribution
  please contribute, You can contribute by either creating [``issue``](https://github.com/chetandhembre/local-require/issues) or just send pull request for ``feature`` you want to include in module.

## License 

(The MIT License)
