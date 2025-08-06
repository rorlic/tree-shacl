import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, expectNoViolation, validateFile, createValidator, 
} from './utilities';

describe('Test TR3.2 (tree:view in root node)', async () => {
  const validator = await createValidator(['tree-common.ttl','TR3.2-tree-view-in-root.ttl']);
  const requiredShape = 'https://w3id.org/tree#CollectionHasViewShape';
  const exampleCollection = 'http://example.org/Collection1';

  it('must not have zero tree:view predicates', async () => {
    expectViolation({ sourceShape: requiredShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/TR3.2/missing-tree-view.ttl', validator));
  });
 
  it('must not have wrong tree:view object', async () => {
    expectViolation({ sourceShape: requiredShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/TR3.2/wrong-tree-view.ttl', validator));
  });

  it('must not have additional tree:view predicates', async () => {
    expectViolation({ sourceShape: requiredShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/TR3.2/additional-tree-view.ttl', validator));
  });

  it('must have a single tree:view predicate', async () => {
    expectNoViolation(requiredShape, 
      await validateFile('./tests/TR3.2/single-tree-view.ttl', validator));
  });
});