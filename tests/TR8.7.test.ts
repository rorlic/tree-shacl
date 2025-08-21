import { it, describe } from 'vitest';
import {
  expectInfo, expectNoInfo, expectViolation, ExpectedResult, validateFile, createValidator,
} from './utilities';

describe('Test TR8.7 (tree:viewDescription usage)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR8.7-view-descriptions-usage.ttl']);
  const suggestedShape = 'https://w3id.org/tree#NodeViewDescriptionSuggestedShape';
  const invalidShape = 'https://w3id.org/tree#NodeViewDescriptionInvalidShape';

  it('may contain a view description', async () => {
    expectInfo({ sourceShape: suggestedShape} as ExpectedResult,
      await validateFile('./tests/TR8.7/no-view-descriptions.ttl', validator));
  });

  it('contains a view description', async () => {
    expectNoInfo(suggestedShape,
      await validateFile('./tests/TR8.7/with-view-descriptions.ttl', validator));
  });

  it('must have an invalid view description', async () => {
    expectViolation({ sourceShape: invalidShape } as ExpectedResult,
      await validateFile('./tests/TR8.7/invalid-view-descriptions.ttl', validator), 3);
  });
});
