import { it, describe } from 'vitest';
import {
  expectViolation, ExpectedResult, validateFile, createValidator,
} from './utilities';

describe('Test TR6.2 (tree:path usage)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR6.2-tree-path-usage.ttl']);
  const pathRequiredShape = 'https://w3id.org/tree#RelationSubclassPathRequiredShape';

  it('must contain a path predicate', async () => {
    expectViolation({ sourceShape: pathRequiredShape } as ExpectedResult,
      await validateFile('./tests/TR6.2/missing-tree-path.ttl', validator), 10);
  });

  // TODO: validate that tree:path is a property path (see valid-tree-path.ttl) - use SHACL shapes SHACL if available
});
