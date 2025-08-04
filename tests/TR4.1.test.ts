import { it, describe } from 'vitest';
import { 
  expectNoViolation, validateFile, createValidator,
} from './utilities';

describe('Test TR4.1 (tree:member usage)', async () => {
  const validator = await createValidator(['tree-common.ttl', 'TR4.1-tree-member-count.ttl']);
  const memberSuggestedShape = 'https://w3id.org/tree#CollectionMemberSuggestedShape';

  it('can have no members', async () => {
    expectNoViolation(memberSuggestedShape, 
      await validateFile('./tests/TR4.1/no-tree-member.ttl', validator));
  });

  it('can have a single member', async () => {
    expectNoViolation(memberSuggestedShape, 
      await validateFile('./tests/TR4.1/single-tree-member.ttl', validator));
  });

  it('can have multiple members', async () => {
    expectNoViolation(memberSuggestedShape, 
      await validateFile('./tests/TR4.1/multiple-tree-members.ttl', validator));
  });

});
