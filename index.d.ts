/// <reference types="node" />

import * as stream from "stream";

declare function finished(stream: NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream, callback: (err?: NodeJS.ErrnoException) => void): () => void;

declare namespace finished {
  export function getPolyfill(): typeof finished;
  export const implementation: typeof finished;
  export function shim(): typeof finished;
}

export = finished;
