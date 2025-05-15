import { it, describe } from 'vitest';
import {
  expectMissingEntityViolation, expectViolation, ExpectedResult, expectNoViolation, 
  validateFile, createValidator, 
} from './utilities';

describe('Test TPPR-04 (contains tree:Node)', async () => {
  const validator = await createValidator(['tree-common-shapes.ttl']);
  const nodeRequiredShape = 'https://w3id.org/tree#NodeTypeRequiredShape';
  const nodeSubjectShape = 'https://w3id.org/tree#NodeSubjectNodeKindShape';
  const focusNode = 'https://w3id.org/tree#Node';

  it('must not have zero tree:Node entities', async () => {
    expectMissingEntityViolation(nodeRequiredShape, 
      await validateFile('./tests/tppr-04/no-tree-node.ttl', validator));
  });

  it('must not have multiple tree:Node entities', async () => {
    expectViolation({ sourceShape: nodeRequiredShape, focusNode: focusNode, path: undefined} as ExpectedResult, 
      await validateFile('./tests/tppr-04/multiple-tree-nodes.ttl', validator));
  });

  it('must have a single tree:Node entity', async () => {
    expectNoViolation(nodeRequiredShape, 
      await validateFile('./tests/tppr-04/single-tree-node.ttl', validator));
  });

  it('must have URL as subject', async () => {
    expectViolation({ sourceShape: nodeSubjectShape, focusNode: focusNode, path: undefined} as ExpectedResult, 
      await validateFile('./tests/tppr-04/invalid-tree-node-subject.ttl', validator));
  });

});
