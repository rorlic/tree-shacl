import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, validateFile,
  createValidator, 
} from './utilities';

describe('Test TPPR-09 (incoming links)', async () => {
  const validator = await createValidator(['tree-structure-shapes.ttl']);
  const viewShape = 'https://w3id.org/tree#IncomingLinksShape';
  const exampleNode = 'http://example.org/Node3';

  it('should not have multiple incoming links', async () => {
    expectViolation({ sourceShape: viewShape, focusNode: exampleNode } as ExpectedResult,
      await validateFile('./tests/tppr-09/multiple-incoming-links.ttl', validator));
  });
});
