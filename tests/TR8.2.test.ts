import { it, describe } from 'vitest';
import { 
  expectNoViolation, validateFile, createValidator, 
} from './utilities';

describe('Test TR8.2 (outgoing links)', async () => {
  const validator = await createValidator(['TR8.2-outgoing-links.ttl']);
  const viewShape = 'https://w3id.org/tree#OutgoingLinksShape';

  it('may have no outgoing links', async () => {
    expectNoViolation(viewShape,
      await validateFile('./tests/TR8.2/no-outgoing-links.ttl', validator));
  });

  it('may have a single outgoing link', async () => {
    expectNoViolation(viewShape, 
      await validateFile('./tests/TR8.2/single-outgoing-link.ttl', validator));
  });

  it('may have a single outgoing link', async () => {
    expectNoViolation(viewShape,
      await validateFile('./tests/TR8.2/multiple-outgoing-links.ttl', validator));
  });
});
