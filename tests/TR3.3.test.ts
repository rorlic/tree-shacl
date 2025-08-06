import { it, describe } from 'vitest';
import { 
  expectViolation, expectWarning, ExpectedResult, expectNoViolation, validateFile,
  createValidator, 
} from './utilities';

describe('Test TR3.3 (tree:view in subsequent node)', async () => {
  const validator = await createValidator(['tree-common.ttl','TR3.3-tree-view-in-subsequent.ttl']);
  const recommendedShape = 'https://w3id.org/tree#CollectionHasViewShape';
  const viewLimitedShape = 'https://w3id.org/tree#CollectionViewLimitedShape';
  const treeView = 'https://w3id.org/tree#view';
  const exampleCollection = 'http://example.org/Collection1';

  it('may have a single tree:view predicate', async () => {
    expectNoViolation(recommendedShape, 
      await validateFile('./tests/TR3.3/single-tree-view.ttl', validator));
  });

  it('should not have zero tree:view predicates', async () => {
    expectWarning({ sourceShape: recommendedShape, focusNode: exampleCollection } as ExpectedResult,
      await validateFile('./tests/TR3.3/no-tree-view.ttl', validator));
  });

  it('must not have additional tree:view predicates', async () => {
    expectViolation({ sourceShape: viewLimitedShape, path: treeView, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/TR3.3/additional-tree-view.ttl', validator));
  });

  it('must not have wrong tree:view object', async () => {
    expectWarning({ sourceShape: recommendedShape, focusNode: exampleCollection } as ExpectedResult,
      await validateFile('./tests/TR3.3/wrong-tree-view.ttl', validator));
  });
});
