import { it, describe } from 'vitest';
import {
  expectInfo, expectNoInfo, expectViolation, ExpectedResult, validateFile, createValidator,
} from './utilities';

describe('Test TR3.7 (tree:value usage)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR3.7-remaining-items-usage.ttl']);
  const suggestedShape = 'https://w3id.org/tree#RelationRemainingItemsSuggestedShape';
  const invalidShape = 'https://w3id.org/tree#RelationRemainingItemsInvalidShape';

  it('may contain a remainingItems predicate', async () => {
    expectInfo({ sourceShape: suggestedShape} as ExpectedResult,
      await validateFile('./tests/TR3.7/no-remaining-items.ttl', validator));
  });

  it('contains a remainingItems predicate', async () => {
    expectNoInfo(suggestedShape,
      await validateFile('./tests/TR3.7/with-remaining-items.ttl', validator));
  });

  it('must have remainingItems as integer value', async () => {
    expectViolation({ sourceShape: invalidShape } as ExpectedResult,
      await validateFile('./tests/TR3.7/iri-remaining-items.ttl', validator));
  });

  it('must have a single remainingItems predicate', async () => {
    expectViolation({ sourceShape: invalidShape } as ExpectedResult,
      await validateFile('./tests/TR3.7/multiple-remaining-items.ttl', validator));
  });
});
