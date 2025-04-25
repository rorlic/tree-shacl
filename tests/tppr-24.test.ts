import { it, describe } from 'vitest';
import {
  expectViolation, ExpectedResult, validateFile, createValidator, expectNoViolation,
} from './utilities';

describe('Test TPPR-24 (geospatially contains)', async () => {
  const validator = await createValidator(['tree-base-shapes.ttl', 'tree-advanced-shapes.ttl']);
  const valueValidShape = 'https://w3id.org/tree#GeospatiallyContainsValueKindShape';
  const treePath = 'https://w3id.org/tree#value';

  it('must not have anything but a WKT literal as tree:value', async () => {
    expectViolation({ sourceShape: valueValidShape, path: treePath } as ExpectedResult,
      await validateFile('./tests/tppr-24/invalid-tree-value.ttl', validator), 4);
  });

  it('must have a WKT literal as tree:value', async () => {
    expectNoViolation(valueValidShape,
      await validateFile('./tests/tppr-24/valid-tree-value.ttl', validator));
  });
});
