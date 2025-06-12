import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, expectNoViolation, validateFile, expectInfo, 
  expectNoInfo, createValidator,
} from './utilities';

describe('Test TPCR-03 (tree:shape usage)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'tree-TPCR-03-tree-shape-usage.ttl']);
  const suggestedShape = 'https://w3id.org/tree#CollectionShapeSuggestedShape';
  const limitedShape = 'https://w3id.org/tree#CollectionShapeLimitedShape';
  const nodeKindShape = 'https://w3id.org/tree#CollectionShapeNodeKindShape';
  const treeShape = 'https://w3id.org/tree#shape';
  const exampleCollection = 'http://example.org/Collection1';

  it('may have zero tree:shape predicates', async () => {
    expectInfo({ sourceShape: suggestedShape, path: treeShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/tpcr-03/no-tree-shape.ttl', validator));
  });

  it('must not have multiple tree:shape predicates', async () => {
    expectViolation({ sourceShape: limitedShape, path: treeShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/tpcr-03/multiple-tree-shapes.ttl', validator));
  });

  it('may have a single tree:shape predicate', async () => {
    const report = await validateFile('./tests/tpcr-03/single-tree-shape.ttl', validator)
    expectNoInfo(suggestedShape, report);
    expectNoViolation(limitedShape, report);
  });

  it('must not have invalid node shapes', async () => {
    expectViolation({ sourceShape: nodeKindShape, path: treeShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/tpcr-03/invalid-tree-shapes.ttl', validator));
  });

  it('may refer using its tree:shape property to one node shape', async () => {
    expectNoViolation(nodeKindShape,
      await validateFile('./tests/tpcr-03/valid-tree-shapes.ttl', validator));
  });

});
