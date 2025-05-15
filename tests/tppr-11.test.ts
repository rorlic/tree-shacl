import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, expectNoViolation, validateFile, createValidator, 
} from './utilities';

describe('Test TPPR-11 (tree:relation usage)', async () => {
  const validator = await createValidator(['tree-common-shapes.ttl']);
  const relationTypeShape = 'https://w3id.org/tree#NodeRelationTypeShape';
  const relationKindShape = 'https://w3id.org/tree#NodeRelationNodeKindShape';
  const treeRelation = 'https://w3id.org/tree#relation';
  const exampleNode = 'http://example.org/Node1';

  it('can have no relations', async () => {
    expectNoViolation(relationTypeShape, 
      await validateFile('./tests/tppr-11/no-tree-relation.ttl', validator));
  });

  it('can have a single relation', async () => {
    expectNoViolation(relationTypeShape, 
      await validateFile('./tests/tppr-11/single-tree-relation.ttl', validator));
  });

  it('can have multiple relations', async () => {
    expectNoViolation(relationTypeShape, 
      await validateFile('./tests/tppr-11/multiple-tree-relations.ttl', validator));
  });

  it('must not have an invalid relation reference', async () => {
    expectViolation({ sourceShape: relationKindShape, path: treeRelation, focusNode: exampleNode } as ExpectedResult,
      await validateFile('./tests/tppr-11/invalid-tree-relation.ttl', validator));
  });

  it('must not refer to a non-relation class', async () => {
    expectViolation({ sourceShape: relationTypeShape, path: treeRelation, focusNode: exampleNode } as ExpectedResult,
      await validateFile('./tests/tppr-11/unknown-tree-relation.ttl', validator));
  });

  it('must refer to a tree:Relation or sub-class', async () => {
    expectNoViolation(relationTypeShape,
      await validateFile('./tests/tppr-11/valid-tree-relation.ttl', validator));
  });
});
