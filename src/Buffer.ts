export type AllowedBufferEncoding = 'ascii' | 'utf-8';

/**
 * Concatenate a list of buffers.
 *
 * @public
 */
export function concat(chunks: Array<Buffer>): Buffer {
  const sum = chunks.map((it) => it.length).reduce((p, c) => p + c, 0);
  return Buffer.concat(chunks, sum);
}

/**
 * Concatenate then encode a list of buffers.
 *
 * @public
 */
export function encode(chunks: Array<Buffer>, encoding: AllowedBufferEncoding): string {
  if (chunks.length === 0) {
    return '';
  }

  return concat(chunks).toString(encoding);
}
