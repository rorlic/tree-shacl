import { it, describe } from 'vitest';
import { 
  expectNoViolation, validateFile, createValidator, 
} from './utilities';

describe('Test TPPR-08 (outgoing links)', async () => {
  const validator = await createValidator(['tree-structure-shapes.ttl']);
  const viewShape = 'https://w3id.org/tree#OutgoingLinksShape';

  it('may have no outgoing links', async () => {
    expectNoViolation(viewShape,
      await validateFile('./tests/tppr-08/no-outgoing-links.ttl', validator));
  });

  it('may have a single outgoing link', async () => {
    expectNoViolation(viewShape, 
      await validateFile('./tests/tppr-08/single-outgoing-link.ttl', validator));
  });

  it('may have a single outgoing link', async () => {
    expectNoViolation(viewShape,
      await validateFile('./tests/tppr-08/multiple-outgoing-links.ttl', validator));
  });
});
