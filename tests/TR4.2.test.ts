import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, expectNoViolation, validateFile, createValidator,
} from './utilities';

describe('Test TR4.2 (tree:member focus node)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR4.2-tree-member-focus-node.ttl']);
  const memberKindShape = 'https://w3id.org/tree#CollectionMemberNodeKindShape';
  const treeMember = 'https://w3id.org/tree#member';
  const exampleCollection = 'http://example.org/Collection1';

  it('must not have an invalid member reference', async () => {
    expectViolation({ sourceShape: memberKindShape, path: treeMember, focusNode: exampleCollection } as ExpectedResult,
      await validateFile('./tests/TR4.2/invalid-tree-member.ttl', validator));
  });

  it('must refer to focus node (named or blank node)', async () => {
    expectNoViolation(memberKindShape,
      await validateFile('./tests/TR4.2/valid-tree-member.ttl', validator));
  });

});
