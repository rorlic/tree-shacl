import { it, describe } from 'vitest';
import {
  expectViolation, ExpectedResult, validateFile, createValidator,
} from './utilities';

describe('Test TPPR-13 (tree:path usage)', async () => {
  const validator = await createValidator(['tree-common-shapes.ttl']);
  const pathRequiredShape = 'https://w3id.org/tree#RelationPathRequiredShape';
  const treePath = 'https://w3id.org/tree#path';

  it('must contain a path predicate', async () => {
    expectViolation({ sourceShape: pathRequiredShape, path: treePath } as ExpectedResult,
      await validateFile('./tests/tppr-13/missing-tree-path.ttl', validator), 10);
  });

  // TODO: validate that tree:path is a property path (see valid-tree-path.ttl) - use SHACL shapes SHACL if available
});
