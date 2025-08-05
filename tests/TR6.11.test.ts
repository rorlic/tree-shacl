import { it, describe } from 'vitest';
import {
  expectViolation, ExpectedResult, validateFile, createValidator, expectNoViolation,
} from './utilities';

describe('Test TR6.11 (geospatially contains)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR6.11-geospatially-contains.ttl']);
  const valueValidShape = 'https://w3id.org/tree#GeospatiallyContainsValueKindShape';
  const treePath = 'https://w3id.org/tree#value';

  it('must not have anything but a WKT literal as tree:value', async () => {
    expectViolation({ sourceShape: valueValidShape, path: treePath } as ExpectedResult,
      await validateFile('./tests/TR6.11/invalid-tree-value.ttl', validator), 4);
  });

  it('must have a WKT literal as tree:value', async () => {
    expectNoViolation(valueValidShape,
      await validateFile('./tests/TR6.11/valid-tree-value.ttl', validator));
  });
});
