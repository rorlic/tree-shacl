import { it, describe } from 'vitest';
import { expectViolation, ExpectedResult, validateFile, createValidator } from './utilities';
import { minCountConstraint, maxCountConstraint, nodeKindConstraint } from './constraints';

describe('Test TPPR-12 (tree:node usage)', async () => {
  const validator = await createValidator(['tree-common.ttl','tree-TPPR-12-tree-node-usage.ttl']);
  const nodeShape = 'https://w3id.org/tree#RelationNodeRequiredShape';
  const treeNode = 'https://w3id.org/tree#node';
  const exampleRelation = 'http://example.org/Relation1';

  it('must refer to one page', async () => {
    expectViolation({ sourceShape: nodeShape, path: treeNode, focusNode: exampleRelation, constraint: minCountConstraint } as ExpectedResult,
      await validateFile('./tests/tppr-12/no-tree-node.ttl', validator));
  });

  it('must not refer to multiple pages', async () => {
    expectViolation({ sourceShape: nodeShape, path: treeNode, focusNode: exampleRelation, constraint: maxCountConstraint } as ExpectedResult,
      await validateFile('./tests/tppr-12/multiple-tree-nodes.ttl', validator));
  });

  it('must not have an invalid node kind', async () => {
    expectViolation({ sourceShape: nodeShape, path: treeNode, focusNode: exampleRelation, constraint: nodeKindConstraint } as ExpectedResult,
      await validateFile('./tests/tppr-12/invalid-tree-node.ttl', validator));
  });

  it('must not have a blank node kind', async () => {
    expectViolation({ sourceShape: nodeShape, path: treeNode, focusNode: exampleRelation, constraint: nodeKindConstraint } as ExpectedResult,
      await validateFile('./tests/tppr-12/blank-tree-node.ttl', validator));
  });
});
