import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, expectNoViolation, validateFile, createValidator, 
} from './utilities';

describe('Test TPPR-06 (tree:view in root)', async () => {
  const validator = await createValidator(['tree-base-shapes.ttl','tree-root-node-shapes.ttl']);
  const nodeShape = 'https://w3id.org/tree#CollectionViewRequiredShape';
  const treeView = 'https://w3id.org/tree#view';
  const exampleCollection = 'http://example.org/Collection1';

  it('must not have zero tree:view predicates', async () => {
    expectViolation({ sourceShape: nodeShape, path: treeView, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/tppr-06/no-tree-view.ttl', validator));
  });

  it('must not have multiple tree:view predicates', async () => {
    expectViolation({ sourceShape: nodeShape, path: treeView, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/tppr-06/multiple-tree-views.ttl', validator));
  });

  it('must have a single tree:view predicate', async () => {
    expectNoViolation(nodeShape, 
      await validateFile('./tests/tppr-06/single-tree-view.ttl', validator));
  });
});