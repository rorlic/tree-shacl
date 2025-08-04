import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, expectNoViolation, validateFile, createValidator, 
} from './utilities';

describe('Test TR3.1 (tree:view in collection)', async () => {
  const validator = await createValidator(['tree-common.ttl','TR3.1-tree-view-in-collection.ttl']);
  const nodeShape = 'https://w3id.org/tree#CollectionViewsRequiredShape';
  const treeView = 'https://w3id.org/tree#view';
  const exampleCollection = 'http://example.org/Collection1';

  it('must not have zero tree:view predicates', async () => {
    expectViolation({ sourceShape: nodeShape, path: treeView, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/TR3.1/no-tree-view.ttl', validator));
  });

  it('may have multiple tree:view predicates', async () => {
    expectNoViolation(nodeShape,
      await validateFile('./tests/TR3.1/multiple-tree-views.ttl', validator));
  });

  it('may have a single tree:view predicate', async () => {
    expectNoViolation(nodeShape, 
      await validateFile('./tests/TR3.1/single-tree-view.ttl', validator));
  });
});