import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, validateFile, createValidator, 
} from './utilities';

describe('Test TPPR-12 (tree:node usage)', async () => {
  const validator = await createValidator(['tree-base-shapes.ttl']);
  const nodeRequiredShape = 'https://w3id.org/tree#RelationNodeRequiredShape';
  const nodeKindShape = 'https://w3id.org/tree#RelationNodeNodeKindShape';
  const treeNode = 'https://w3id.org/tree#node';
  const exampleRelation = 'http://example.org/Relation1';

  it('must refer to one page', async () => {
    expectViolation({ sourceShape: nodeRequiredShape, path: treeNode, focusNode: exampleRelation } as ExpectedResult,
      await validateFile('./tests/tppr-12/no-tree-node.ttl', validator));
  });

  it('must not refer to multiple pages', async () => {
    expectViolation({ sourceShape: nodeRequiredShape, path: treeNode, focusNode: exampleRelation } as ExpectedResult,
      await validateFile('./tests/tppr-12/multiple-tree-nodes.ttl', validator));
  });

  it('must not have an invalid node kind', async () => {
    expectViolation({ sourceShape: nodeKindShape, path: treeNode, focusNode: exampleRelation } as ExpectedResult,
      await validateFile('./tests/tppr-12/invalid-tree-node.ttl', validator));
  });

  it('must not have a blank node kind', async () => {
    expectViolation({ sourceShape: nodeKindShape, path: treeNode, focusNode: exampleRelation } as ExpectedResult,
      await validateFile('./tests/tppr-12/blank-tree-node.ttl', validator));
  });
});
