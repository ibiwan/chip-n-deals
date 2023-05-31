import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'crypto';

import { GqlModel } from '@/types';

import { Player } from './player.domain.object';
import { PlayerCore } from './player.core';

@ObjectType('Player')
export class PlayerModel implements PlayerCore, GqlModel<Player> {
  constructor(username: string, opaqueId: UUID, passhash: string = null) {
    this.username = username;
    this.passhash = passhash;
    this.opaqueId = opaqueId;
  }

  @Field() opaqueId?: UUID;
  @Field() username: string;
  @Field() passhash: string;
  @Field() isAdmin: boolean = false;
}
