'use strict';

// taken from https://github.com/nodejs/node/blob/master/test/parallel/test-stream-finished.js

var common = require('./common');

var finished = require('..');

var assert = require('assert');
var fs = require('fs');
var stream = require('stream');
var util = require('util');

try {
  var promisify = require('util.promisify');
} catch (e) {}

common.crashOnUnhandledRejection();

(function () {
  function MyReadable () {
    stream.Readable.call(this);
  }
  MyReadable.prototype._read = function () { };
  util.inherits(MyReadable, stream.Readable);

  var rs = new MyReadable();

  finished(rs, common.mustCall(function (err) {
    assert(!err, 'no error');
  }));

  rs.push(null);
  rs.resume();
})();

(function () {
  function MyWritable () {
    stream.Writable.call(this);
  }
  MyWritable.prototype._write = function (data, enc, cb) {
    cb();
  };
  util.inherits(MyWritable, stream.Writable);

  var ws = new MyWritable();

  finished(ws, common.mustCall(function (err) {
    assert(!err, 'no error');
  }));

  ws.end();
})();

(function () {
  function MyTransform () {
    stream.Transform.call(this);
  }
  MyTransform.prototype._transform = function (data, enc, cb) {
    cb();
  };
  util.inherits(MyTransform, stream.Transform);

  var tr = new MyTransform();

  var finish = false;
  var ended = false;

  tr.on('end', function () {
    ended = true;
  });

  tr.on('finish', function () {
    finish = true;
  });

  finished(tr, common.mustCall(function (err) {
    assert(!err, 'no error');
    assert(finish);
    assert(ended);
  }));

  tr.end();
  tr.resume();
})();

(function () {
  var rs = fs.createReadStream(__filename);

  rs.resume();
  finished(rs, common.mustCall());
})();

(function () {
  if (!promisify) return;

  try {
    var finishedPromise = promisify(finished);
  } catch (e) {
    return;
  }

  function run () {
    var rs = fs.createReadStream(__filename);
    var done = common.mustCall();

    var ended = false;
    rs.resume();
    rs.on('end', function () {
      ended = true;
    });
    return finishedPromise(rs)
      .then(function () {
        assert(ended);
        done();
      });
  }

  run();
})();

(function () {
  var rs = fs.createReadStream('file-does-not-exist');

  finished(rs, common.mustCall(function (err) {
    assert.strictEqual(err.code, 'ENOENT');
  }));
})();

(function () {
  function MyReadable () {
    stream.Readable.call(this);
  }
  MyReadable.prototype._read = function () { };
  util.inherits(MyReadable, stream.Readable);

  var rs = new MyReadable();

  finished(rs, common.mustCall(function (err) {
    assert(!err, 'no error');
  }));

  rs.push(null);
  rs.emit('close'); // should not trigger an error
  rs.resume();
})();

(function () {
  function MyReadable () {
    stream.Readable.call(this);
  }
  MyReadable.prototype._read = function () { };
  util.inherits(MyReadable, stream.Readable);

  var rs = new MyReadable();

  finished(rs, common.mustCall(function (err) {
    assert(err, 'premature close error');
  }));

  rs.emit('close'); // should trigger error
  rs.push(null);
  rs.resume();
})();
