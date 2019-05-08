import * as fs from 'fs';

// import finished = require('stream.finished');
import finished = require('..');

const rs = fs.createReadStream(__filename);

finished(rs, err => {
  if (err) {
    console.error('Stream failed.', err);
  } else {
    console.info('Stream is done reading.');
  }
});

rs.resume(); // drain the stream
