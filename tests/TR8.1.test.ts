import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, expectNoViolation, validateFile, expectWarning, 
  expectNoInfo, createValidator,
} from './utilities';

describe('Test TR8.1 (tree:shape usage)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR8.1-tree-shape-usage.ttl']);
  const suggestedShape = 'https://w3id.org/tree#CollectionShapeSuggestedShape';
  const limitedShape = 'https://w3id.org/tree#CollectionShapeLimitedShape';
  const nodeKindShape = 'https://w3id.org/tree#CollectionShapeNodeKindShape';
  const treeShape = 'https://w3id.org/tree#shape';
  const exampleCollection = 'http://example.org/Collection1';

  it('may have zero tree:shape predicates', async () => {
    expectWarning({ sourceShape: suggestedShape, path: treeShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/TR8.1/no-tree-shape.ttl', validator));
  });

  it('must not have multiple tree:shape predicates', async () => {
    expectViolation({ sourceShape: limitedShape, path: treeShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/TR8.1/multiple-tree-shapes.ttl', validator));
  });

  it('may have a single tree:shape predicate', async () => {
    const report = await validateFile('./tests/TR8.1/single-tree-shape.ttl', validator)
    expectNoInfo(suggestedShape, report);
    expectNoViolation(limitedShape, report);
  });

  it('must not have invalid node shapes', async () => {
    expectViolation({ sourceShape: nodeKindShape, path: treeShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/TR8.1/invalid-tree-shapes.ttl', validator));
  });

  it('may refer using its tree:shape property to one node shape', async () => {
    expectNoViolation(nodeKindShape,
      await validateFile('./tests/TR8.1/valid-tree-shapes.ttl', validator));
  });

});
