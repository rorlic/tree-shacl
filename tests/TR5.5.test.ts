import { it, describe } from 'vitest';
import { expectViolation, ExpectedResult, expectNoViolation, validateFile, createValidator } from './utilities';
import { nodeKindConstraint, classConstraint } from './constraints';

describe('Test TR5.5 (tree:relation usage)', async () => {
  const validator = await createValidator(['tree-common.ttl','TR5.5-tree-relation-usage.ttl']);
  const relationShape = 'https://w3id.org/tree#NodeRelationTypeShape';
  const treeRelation = 'https://w3id.org/tree#relation';
  const exampleNode = 'http://example.org/Node1';

  it('can have no relations', async () => {
    expectNoViolation(relationShape, 
      await validateFile('./tests/TR5.5/no-tree-relation.ttl', validator));
  });

  it('can have a single relation', async () => {
    expectNoViolation(relationShape, 
      await validateFile('./tests/TR5.5/single-tree-relation.ttl', validator));
  });

  it('can have multiple relations', async () => {
    expectNoViolation(relationShape, 
      await validateFile('./tests/TR5.5/multiple-tree-relations.ttl', validator));
  });

  it('must not have an invalid relation reference', async () => {
    expectViolation({ sourceShape: relationShape, path: treeRelation, focusNode: exampleNode, constraint: nodeKindConstraint } as ExpectedResult,
      await validateFile('./tests/TR5.5/invalid-tree-relation.ttl', validator));
  });

  it('must not refer to a non-relation class', async () => {
    expectViolation({ sourceShape: relationShape, path: treeRelation, focusNode: exampleNode, constraint: classConstraint } as ExpectedResult,
      await validateFile('./tests/TR5.5/unknown-tree-relation.ttl', validator));
  });

  it('must refer to a tree:Relation or sub-class', async () => {
    expectNoViolation(relationShape,
      await validateFile('./tests/TR5.5/valid-tree-relation.ttl', validator));
  });
});
