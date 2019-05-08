var fs = require('fs');

// var finished = require('stream.finished');
var finished = require('..');

var rs = fs.createReadStream(__filename);

finished(rs, function(err) {
  if (err) {
    console.error('Stream failed.', err);
  } else {
    console.info('Stream is done reading.');
  }
});

rs.resume(); // drain the stream
