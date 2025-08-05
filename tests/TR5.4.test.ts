import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, validateFile,
  createValidator, expectNoViolation, 
} from './utilities';

describe('Test TR5.4 (incoming links)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR5.4-incoming-links.ttl']);
  const linksShape = 'https://w3id.org/tree#IncomingLinksShape';
  const exampleNode = 'http://example.org/Node3';

  it('should not have multiple incoming links', async () => {
    expectViolation({ sourceShape: linksShape, focusNode: exampleNode } as ExpectedResult,
      await validateFile('./tests/TR5.4/multiple-incoming-links.ttl', validator));
  });

  it('may link to same node using multiple relations ', async () => {
    expectNoViolation(linksShape,
      await validateFile('./tests/TR5.4/multiple-relations-to-node.ttl', validator));
  });
});
