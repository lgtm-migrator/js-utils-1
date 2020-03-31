import { expect } from 'chai';

import { NotFoundError } from '../../src/error/NotFoundError';
import { countOf, defaultWhen, filterNil, mustCoalesce, mustFind } from '../../src/Maybe';
import { describeLeaks, itLeaks } from '../helpers/async';
import { hasItems, ensureArray } from '../../src';

describeLeaks('utils', async () => {
  describeLeaks('count list', async () => {
    itLeaks('should count a single item', async () => {
      expect(countOf(1)).to.equal(1, 'numbers');
      expect(countOf('')).to.equal(1, 'empty strings');
      expect(countOf('123')).to.equal(1, 'other strings');
    });

    itLeaks('should count an array of items', async () => {
      expect(countOf([1])).to.equal(1, 'single item list');
      expect(countOf([1, 2, 3])).to.equal(3, 'multi item list');
    });

    itLeaks('should count an unknown argument as 0', async () => {
      expect(countOf(undefined)).to.equal(0, 'undefined');
      // eslint-disable-next-line no-null/no-null
      expect(countOf(null)).to.equal(0, 'null');
    });
  });

  describeLeaks('filter nil', async () => {
    itLeaks('should remove nil items', async () => {
      // eslint-disable-next-line no-null/no-null
      expect(filterNil([1, undefined, 2, null, 3])).to.deep.equal([1, 2, 3]);
    });
  });

  describeLeaks('must find helper', async () => {
    itLeaks('should return matching item', async () => {
      expect(mustFind([1, 2, 3], (val) => (val % 2) === 0)).to.equal(2);
    });

    itLeaks('should throw if no item matches', async () => {
      expect(() => {
        mustFind([1, 2, 3], (val) => val === 4);
      }).to.throw(NotFoundError);
    });
  });

  describeLeaks('default when', async () => {
    itLeaks('should return the first item when the condition is true', async () => {
      expect(defaultWhen(true, 1, 2)).to.equal(1);
    });

    itLeaks('should return the second item otherwise', async () => {
      expect(defaultWhen(false, 1, 2)).to.equal(2);
    });
  });

  describeLeaks('must coalesce helper', async () => {
    /* eslint-disable no-null/no-null */
    itLeaks('should return the first existent value', async () => {
      expect(mustCoalesce(null, null, 3, null)).to.equal(3);
      expect(mustCoalesce(null, null, undefined, 'string')).to.equal('string');
      expect(mustCoalesce(null, undefined, [], null)).to.deep.equal([]);
    });
    /* eslint-enable no-null/no-null */
  });

  describeLeaks('has items helper', async () => {
    itLeaks('should return false for non-array values', async () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      expect(hasItems({} as any)).to.equal(false);
      expect(hasItems(4 as any)).to.equal(false);
      /* eslint-enable @typescript-eslint/no-explicit-any */
    });

    itLeaks('should return false for empty arrays', async () => {
      expect(hasItems([])).to.equal(false);
    });

    itLeaks('should return true for arrays with elements', async () => {
      expect(hasItems([
        true,
        false,
      ])).to.equal(true);
    });
  });

  describeLeaks('ensure array helper', async () => {
    itLeaks('should convert nil values to arrays', async () => {
      /* eslint-disable-next-line no-null/no-null */
      expect(ensureArray(null)).to.deep.equal([]);
      expect(ensureArray(undefined)).to.deep.equal([]);
    });

    itLeaks('should copy arrays', async () => {
      const data: Array<number> = [];
      const copy = ensureArray(data);

      expect(copy).not.to.equal(data);
      expect(copy).to.deep.equal(data);
    });
  });
});
