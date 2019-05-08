import * as fs from 'fs';
import * as util from 'util';

// import finished = require('stream.finished');
import finished = require('..');

// Have to wait for https://github.com/DefinitelyTyped/DefinitelyTyped/pull/35270
// tslint:disable-next-line:no-var-requires
const promisify = require('util.promisify') as typeof util.promisify;
const finishedPromise = promisify(finished);

const rs = fs.createReadStream(__filename);

async function run(): Promise<void> {
  await finishedPromise(rs);
  console.info('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // drain the stream
