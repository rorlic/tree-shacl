import { it, describe } from 'vitest';
import { 
  expectViolation, expectInfo, ExpectedResult, expectNoViolation, validateFile,
  createValidator, 
} from './utilities';

describe('Test TPPR-07 (tree:view in non-root)', async () => {
  const validator = await createValidator(['tree-common-shapes.ttl','tree-non-root-node-shapes.ttl']);
  const viewRecommendedShape = 'https://w3id.org/tree#CollectionViewSuggestedShape';
  const viewLimitedShape = 'https://w3id.org/tree#CollectionViewLimitedShape';
  const treeView = 'https://w3id.org/tree#view';
  const exampleCollection = 'http://example.org/Collection1';

  it('may have a single tree:view predicate', async () => {
    expectNoViolation(viewRecommendedShape, 
      await validateFile('./tests/tppr-07/single-tree-view.ttl', validator));
  });

  it('should not have zero tree:view predicates', async () => {
    expectInfo({ sourceShape: viewRecommendedShape, path: treeView, focusNode: exampleCollection } as ExpectedResult,
      await validateFile('./tests/tppr-07/no-tree-view.ttl', validator));
  });

  it('must not have multiple tree:view predicates', async () => {
    expectViolation({ sourceShape: viewLimitedShape, path: treeView, focusNode: exampleCollection } as ExpectedResult,
      await validateFile('./tests/tppr-07/multiple-tree-view.ttl', validator));
  });
});
