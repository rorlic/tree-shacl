import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, expectNoViolation, validateFile, createValidator, 
} from './utilities';

describe('Test TR3.4 (tree:Collection IRI)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR3.4-tree-Collection-IRI.ttl']);
  const relationKindShape = 'https://w3id.org/tree#CollectionTypeNodeKindShape';
  const treeCollection = 'https://w3id.org/tree#Collection';

  it('must not be identified using a blank node', async () => {
    expectViolation({ sourceShape: relationKindShape, focusNode: treeCollection, path: undefined } as ExpectedResult,
      await validateFile('./tests/TR3.4/invalid-tree-collection-id.ttl', validator));
  });

  it('must be identified using a named node (and not a blank node)', async () => {
    expectNoViolation(relationKindShape,
      await validateFile('./tests/TR3.4/valid-tree-collection-id.ttl', validator));
  });
});
