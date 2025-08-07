import { it, describe } from 'vitest';
import {
  expectInfo, expectNoInfo, expectViolation, ExpectedResult, validateFile, createValidator,
} from './utilities';

describe('Test TR8.7 (tree:search usage)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR8.7-view-descriptions-usage.ttl']);
  const suggestedShape = 'https://w3id.org/tree#NodeViewDescriptionSuggestedShape';
  const invalidShape = 'https://w3id.org/tree#NodeViewDescriptionInvalidShape';

  it('may contain a search form predicate', async () => {
    expectInfo({ sourceShape: suggestedShape} as ExpectedResult,
      await validateFile('./tests/TR8.7/no-view-descriptions.ttl', validator));
  });

  it('contains a search form predicate', async () => {
    expectNoInfo(suggestedShape,
      await validateFile('./tests/TR8.7/with-view-descriptions.ttl', validator));
  });

  it('must have a hydra:IriTemplate as reference', async () => {
    expectViolation({ sourceShape: invalidShape } as ExpectedResult,
      await validateFile('./tests/TR8.7/invalid-view-descriptions.ttl', validator), 3);
  });
});
