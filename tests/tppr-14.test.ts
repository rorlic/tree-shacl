import { it, describe } from 'vitest';
import {
  expectViolation, ExpectedResult, validateFile, createValidator, expectNoViolation,
} from './utilities';

describe('Test TPPR-14 (tree:value usage)', async () => {
  const validator = await createValidator(['tree-common-shapes.ttl', 'tree-relation-shapes.ttl']);
  const valueRequiredShape = 'https://w3id.org/tree#RelationValueRequiredShape';
  const valueValidShape = 'https://w3id.org/tree#RelationValueKindShape';
  const treePath = 'https://w3id.org/tree#value';

  it('must contain a value predicate', async () => {
    expectViolation({ sourceShape: valueRequiredShape, path: treePath } as ExpectedResult,
      await validateFile('./tests/tppr-14/missing-tree-value.ttl', validator), 10);
  });

  it('must not have anything but a literal or URI as tree:value', async () => {
    expectViolation({ sourceShape: valueValidShape, path: treePath } as ExpectedResult,
      await validateFile('./tests/tppr-14/invalid-tree-value.ttl', validator), 10);
  });

  it('must have a literal or URI as tree:value', async () => {
    expectNoViolation(valueValidShape,
      await validateFile('./tests/tppr-14/valid-tree-value.ttl', validator));
  });
});
