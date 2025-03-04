import { Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';

@Resolver('User')
export class UserResolver {
  public constructor(private readonly userService: UserService) {}


  @Query(() => [UserModel], {name: 'findAllUsers'})
  public async findAll() {
    return await this.userService.findAll();
  }
}
