import { it, describe } from 'vitest';
import {
  expectViolation, ExpectedResult, validateFile, createValidator, expectNoViolation,
} from './utilities';

describe('Test TPPR-14 (tree:value usage)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'tree-TPPR-14-tree-value-usage.ttl']);
  const valueRequiredShape = 'https://w3id.org/tree#RelationSubclassValueRequiredShape';

  it('must contain a value predicate', async () => {
    expectViolation({ sourceShape: valueRequiredShape} as ExpectedResult,
      await validateFile('./tests/tppr-14/missing-tree-value.ttl', validator), 10);
  });

  it('must not have anything but a literal or URI as tree:value', async () => {
    expectViolation({ sourceShape: valueRequiredShape } as ExpectedResult,
      await validateFile('./tests/tppr-14/invalid-tree-value.ttl', validator), 10);
  });

  it('must have a literal or URI as tree:value', async () => {
    expectNoViolation(valueRequiredShape,
      await validateFile('./tests/tppr-14/valid-tree-value.ttl', validator));
  });
});
