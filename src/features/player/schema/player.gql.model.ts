import { UUID } from 'crypto';

import { Field, ObjectType } from '@nestjs/graphql';

import { GqlModel } from '@/util/root.types';

import { SqlBool } from '@/datasource/sqlite.util';

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
  @Field() isAdmin: number = SqlBool.False;

  static fromDomainObject(player: Player): PlayerModel {
    return new PlayerModel(player.username, player.opaqueId, null);
  }

  toDomainObject(): Player {
    return new Player(
      this.username,
      this.passhash,
      null,
      this.opaqueId,
      this.isAdmin == SqlBool.True,
    );
  }
}
