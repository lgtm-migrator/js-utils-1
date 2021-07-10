import { TimeoutError } from './error/TimeoutError';
import { PredicateC0 } from './Predicate';

/**
 * Resolve after a set amount of time.
 * @public
 */
export function defer(ms: number): Promise<void> {
  return new Promise((res, _rej) => {
    setTimeout(() => {
      res();
    }, ms);
  });
}

export function deferValue<T>(ms: number, val: T): Promise<T> {
  return new Promise((res, _rej) => {
    setTimeout(() => {
      res(val);
    }, ms);
  });
}

/**
 * Reject after a set amount of time if the original promise has not yet resolved.
 * @public
 */
export function timeout<T>(ms: number, oper: Promise<T>): Promise<T> {
  const limit = new Promise<T>((_res, rej) => {
    setTimeout(() => {
      rej(new TimeoutError());
    }, ms);
  });

  return Promise.race([limit, oper]);
}

/**
 * Reject after a set number of attempts if the given predicate does not return true.
 * @public
 * @throws TimeoutError
 */
export async function waitFor(cb: PredicateC0, step: number, count: number): Promise<void> {
  let accum = 0;
  while (accum < count) {
    await defer(step);
    if (cb()) {
      return;
    }
    accum += 1;
  }

  throw new TimeoutError();
}
