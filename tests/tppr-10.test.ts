import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, validateFile,
  createValidator, 
} from './utilities';

describe('Test TPPR-10 (incoming links)', async () => {
  const validator = await createValidator(['tree-TPPR-10-self-link.ttl']);
  const viewShape = 'https://w3id.org/tree#NodeSelfLinkShape';

  it('should not have a link to itself', async () => {
    expectViolation({ sourceShape: viewShape } as ExpectedResult,
      await validateFile('./tests/tppr-10/self-link.ttl', validator));
  });
});
