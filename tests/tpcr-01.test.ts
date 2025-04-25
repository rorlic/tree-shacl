import { it, describe } from 'vitest';
import { 
  expectViolation, ExpectedResult, expectNoViolation, validateFile, createValidator,
} from './utilities';

describe('Test TPCR-01 (tree:member usage)', async () => {
  const validator = await createValidator(['tree-base-shapes.ttl']);
  const memberSuggestedShape = 'https://w3id.org/tree#CollectionMemberSuggestedShape';
  const memberKindShape = 'https://w3id.org/tree#CollectionMemberNodeKindShape';
  const treeMember = 'https://w3id.org/tree#member';
  const exampleCollection = 'http://example.org/Collection1';

  it('can have no members', async () => {
    expectNoViolation(memberSuggestedShape, 
      await validateFile('./tests/tpcr-01/no-tree-member.ttl', validator));
  });

  it('can have a single member', async () => {
    expectNoViolation(memberSuggestedShape, 
      await validateFile('./tests/tpcr-01/single-tree-member.ttl', validator));
  });

  it('can have multiple members', async () => {
    expectNoViolation(memberSuggestedShape, 
      await validateFile('./tests/tpcr-01/multiple-tree-members.ttl', validator));
  });

  it('must not have an invalid member reference', async () => {
    expectViolation({ sourceShape: memberKindShape, path: treeMember, focusNode: exampleCollection } as ExpectedResult,
      await validateFile('./tests/tpcr-01/invalid-tree-member.ttl', validator));
  });

  it('must refer to focus node (named or blank node)', async () => {
    expectNoViolation(memberKindShape,
      await validateFile('./tests/tpcr-01/valid-tree-member.ttl', validator));
  });

});
