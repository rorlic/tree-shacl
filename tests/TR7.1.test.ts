import { it, describe } from 'vitest';
import {
  expectInfo, expectNoInfo, expectViolation, ExpectedResult, validateFile, createValidator,
} from './utilities';

describe('Test TR7.1 (tree:search usage)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR7.1-search-forms-usage.ttl']);
  const suggestedShape = 'https://w3id.org/tree#NodeSearchFormSuggestedShape';
  const invalidShape = 'https://w3id.org/tree#NodeSearchFormInvalidShape';

  it('may contain a search form predicate', async () => {
    expectInfo({ sourceShape: suggestedShape} as ExpectedResult,
      await validateFile('./tests/TR7.1/no-search-forms.ttl', validator));
  });

  it('contains a search form predicate', async () => {
    expectNoInfo(suggestedShape,
      await validateFile('./tests/TR7.1/with-search-forms.ttl', validator));
  });

  it('must have a hydra:IriTemplate as reference', async () => {
    expectViolation({ sourceShape: invalidShape } as ExpectedResult,
      await validateFile('./tests/TR7.1/invalid-search-forms.ttl', validator), 4);
  });
});
