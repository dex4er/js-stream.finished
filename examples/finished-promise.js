var fs = require('fs');

// var finished = require('stream.finished');
var finished = require('..');

var promisify = require('util.promisify');
var finishedPromise = promisify(finished);

var rs = fs.createReadStream(__filename);

finishedPromise(rs)
  .then(function() {
    console.info('Stream is done reading.');
  })
  .catch(console.error);

rs.resume(); // drain the stream
