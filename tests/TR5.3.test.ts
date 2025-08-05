import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, validateFile,
  createValidator, 
} from './utilities';

describe('Test TR-5.3 (no self link)', async () => {
  const validator = await createValidator(['TR5.3-self-link.ttl']);
  const viewShape = 'https://w3id.org/tree#NodeSelfLinkShape';

  it('should not have a link to itself', async () => {
    expectViolation({ sourceShape: viewShape } as ExpectedResult,
      await validateFile('./tests/TR5.3/self-link.ttl', validator));
  });
});
