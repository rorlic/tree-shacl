import { it, describe } from 'vitest';
import { expectViolation, expectNoViolation, validateFile, ExpectedResult, createValidator } from './utilities';
import { minCountConstraint, maxCountConstraint } from './constraints';

describe('Test TPPR-05 (contains tree:Collection)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'tree-TPPR-05-contains-tree-Collection.ttl']);
  const nodeShape = 'https://w3id.org/tree#CollectionTypeRequiredShape';
  const focusNode = 'https://w3id.org/tree#Collection';

  it('must not have zero tree:Collection entities', async () => {
    expectViolation({ sourceShape: nodeShape, focusNode: focusNode, constraint: minCountConstraint } as ExpectedResult,
      await validateFile('./tests/tppr-05/no-tree-collection.ttl', validator));
  });

  it('must not have multiple tree:Collection entities', async () => {
    expectViolation({ sourceShape: nodeShape, focusNode: focusNode, constraint: maxCountConstraint } as ExpectedResult,
      await validateFile('./tests/tppr-05/multiple-tree-collections.ttl', validator));
  });

  it('must have a single tree:Collection entity', async () => {
    expectNoViolation(nodeShape,
      await validateFile('./tests/tppr-05/single-tree-collection.ttl', validator));
  });
});
