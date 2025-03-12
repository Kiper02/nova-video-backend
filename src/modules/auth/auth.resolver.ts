import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterInput } from './inputs/register.input';
import { GqlContext } from 'src/shared/types/gql-context.type';
import { LoginInput } from './inputs/login.input';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean, { name: 'register' })
  public async register(
    @Args('data') input: RegisterInput,
  ) {
    return await this.authService.register(input);
  }

  @Mutation(() => Boolean, { name: 'login' })
  public async login(
    @Args('data') input: LoginInput,
    @Context() { req }: GqlContext,
  ) {
    return await this.authService.login(req, input);
  }

  @Mutation(() => Boolean, { name: 'logout' })
  public async logout(@Context() { req, res }: GqlContext) {
    console.log('asd');
    return await this.authService.logout(req, res);
  }
}
