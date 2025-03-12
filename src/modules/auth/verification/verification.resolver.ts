import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { VerificationService } from './verification.service';
import { VerificationInput } from './inputs/verification.input';
import { GqlContext } from 'src/shared/types/gql-context.type';

@Resolver('Verification')
export class VerificationResolver {
  public constructor(
    private readonly verificationService: VerificationService,
  ) {}

  @Mutation(() => Boolean, { name: 'emailVerify' })
  public async verify(
    @Args('data') input: VerificationInput,
    @Context() { req }: GqlContext,
  ) {
    return await this.verificationService.verify(req, input);
  }
}
