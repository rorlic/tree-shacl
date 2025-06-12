import { it, describe } from 'vitest';
import { expectViolation, ExpectedResult, expectNoViolation, validateFile, createValidator } from './utilities';
import { nodeKindConstraint, minCountConstraint, maxCountConstraint } from './constraints';

describe('Test TPPR-04 (contains tree:Node)', async () => {
  const validator = await createValidator(['tree-TPPR-04-contains-tree-Node.ttl']);
  const nodeShape = 'https://w3id.org/tree#NodeTypeRequiredShape';
  const focusNode = 'https://w3id.org/tree#Node';

  it('must not have zero tree:Node entities', async () => {
    expectViolation({ sourceShape: nodeShape, focusNode: focusNode, constraint: minCountConstraint } as ExpectedResult,
      await validateFile('./tests/tppr-04/no-tree-node.ttl', validator));
  });

  it('must not have multiple tree:Node entities', async () => {
    expectViolation({ sourceShape: nodeShape, focusNode: focusNode, constraint: maxCountConstraint } as ExpectedResult,
      await validateFile('./tests/tppr-04/multiple-tree-nodes.ttl', validator));
  });

  it('must have a single tree:Node entity', async () => {
    expectNoViolation(nodeShape,
      await validateFile('./tests/tppr-04/single-tree-node.ttl', validator));
  });

  it('must have URL as subject', async () => {
    expectViolation({ sourceShape: nodeShape, focusNode: focusNode, constraint: nodeKindConstraint } as ExpectedResult,
      await validateFile('./tests/tppr-04/invalid-tree-node-subject.ttl', validator));
  });

});
