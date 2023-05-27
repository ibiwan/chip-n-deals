import { Field, InputType } from '@nestjs/graphql';
import { PlayerCore } from './player.core';

@InputType('CreatePlayerInput')
export class CreatePlayerDto implements PlayerCore {
  @Field() username: string;
  @Field() password: string;
}
