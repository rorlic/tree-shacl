import { it, describe } from 'vitest';
import {
  expectViolation, ExpectedResult, validateFile, createValidator, expectNoViolation,
} from './utilities';

describe('Test TR6.3 (tree:value usage)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR6.3-tree-value-usage.ttl']);
  const valueRequiredShape = 'https://w3id.org/tree#RelationSubclassValueRequiredShape';

  it('must contain a value predicate', async () => {
    expectViolation({ sourceShape: valueRequiredShape} as ExpectedResult,
      await validateFile('./tests/TR6.3/missing-tree-value.ttl', validator), 10);
  });

  it('must not have anything but a literal or URI as tree:value', async () => {
    expectViolation({ sourceShape: valueRequiredShape } as ExpectedResult,
      await validateFile('./tests/TR6.3/invalid-tree-value.ttl', validator), 10);
  });

  it('must have a literal or URI as tree:value', async () => {
    expectNoViolation(valueRequiredShape,
      await validateFile('./tests/TR6.3/valid-tree-value.ttl', validator));
  });
});
