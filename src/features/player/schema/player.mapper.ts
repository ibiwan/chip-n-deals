import {
  DBEntity,
  DomainObjectMapper,
  DtoObject,
  GqlModel,
} from '@/util/root.types';
import { Injectable } from '@nestjs/common';

import { PlayerEntity } from './player.db.entity';
import { PlayerModel } from './player.gql.model';
import { Player } from './player.domain.object';
import { SqlBool } from '@/datasource/sqlite.util';

@Injectable()
export class PlayerMapper implements DomainObjectMapper<Player> {
  dbFromDto(dto: DtoObject<Player>, ...more: any): Promise<DBEntity<Player>> {
    throw new Error('Method not implemented.');
  }
  dbFromDomainMany(_obj: Player[]): Promise<DBEntity<Player>[]> {
    throw new Error('Method not implemented.');
  }
  dbFromGqlMany(
    mod: GqlModel<Player>[],
    ...more: any
  ): Promise<DBEntity<Player>[]> {
    throw new Error('Method not implemented.');
  }
  async gqlFromDomainMany(
    _obj: Player[],
    ...more: any
  ): Promise<PlayerModel[]> {
    throw new Error('Method not implemented: PlayerMapper:gqlFromDomainMany');
  }

  async gqlFromDbMany(
    ent: PlayerEntity[],
    ...more: any
  ): Promise<GqlModel<Player>[]> {
    throw new Error('Method not implemented: PlayerMapper:gqlFromDbMany');
  }

  async domainFromDbMany(
    ents: PlayerEntity[],
    ...more: any
  ): Promise<Player[]> {
    throw new Error('Method not implemented: PlayerMapper:domainFromDbMany');
  }

  async gqlFromDomain(player: Player): Promise<PlayerModel> {
    const playerModel = new PlayerModel(
      player.username,
      player.opaqueId,
      player.passhash,
    );

    return playerModel;
  }

  async dbFromDomain(player: Player): Promise<PlayerEntity> {
    const playerEntity = new PlayerEntity(player.username, player.passhash);

    playerEntity.id = player.id;
    playerEntity.isAdmin = player.isAdmin ? SqlBool.True : SqlBool.False;
    playerEntity.opaqueId = player.opaqueId;

    return playerEntity;
  }

  async gqlFromDb(playerEntity: PlayerEntity): Promise<PlayerModel> {
    const playerModel = new PlayerModel(
      playerEntity.username,
      playerEntity.opaqueId,
      playerEntity.passhash,
    );
    playerModel.isAdmin = playerEntity.isAdmin == SqlBool.True;

    return playerModel;
  }

  async domainFromDb(
    playerEntity: PlayerEntity,
    ...more: any
  ): Promise<Player> {
    return new Player(
      playerEntity.username,
      playerEntity.passhash,
      playerEntity.id,
      playerEntity.opaqueId,
      playerEntity.isAdmin == SqlBool.True,
    );
  }

  async dbFromGql(mod: GqlModel<Player>): Promise<PlayerEntity> {
    throw new Error('Method not implemented: PlayerMapper:dbFromGql');
  }
}
