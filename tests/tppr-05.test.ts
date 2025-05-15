import { it, describe } from 'vitest';
import { 
  expectMissingEntityViolation, expectViolation, expectNoViolation, validateFile, 
  ExpectedResult, createValidator, 
} from './utilities';

describe('Test TPPR-05 (contains tree:Collection)', async () => {
  const validator = await createValidator(['tree-base-shapes.ttl']);
  const nodeShape = 'https://w3id.org/tree#CollectionTypeRequiredShape';
  const focusNode = 'https://w3id.org/tree#Collection';

  it('must not have zero tree:Collection entities', async () => {
    expectMissingEntityViolation(nodeShape, 
      await validateFile('./tests/tppr-05/no-tree-collection.ttl', validator));
  });

  it('must not have multiple tree:Collection entities', async () => {
    expectViolation({ sourceShape: nodeShape, focusNode: focusNode, path: undefined} as ExpectedResult, 
      await validateFile('./tests/tppr-05/multiple-tree-collections.ttl', validator));
  });

  it('must have a single tree:Collection entity', async () => {
    expectNoViolation(nodeShape, 
      await validateFile('./tests/tppr-05/single-tree-collection.ttl', validator));
  });
});
