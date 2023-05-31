import { Injectable } from '@nestjs/common';

import { SqlBool } from '@/util/sqlite.util';
import { DBEntity, DomainObjectMapper, DtoObject, GqlModel } from '@/types';

import { PlayerEntity } from './player.db.entity';
import { PlayerModel } from './player.gql.model';
import { Player } from './player.domain.object';

@Injectable()
export class PlayerMapper implements DomainObjectMapper<Player> {
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
    ..._more: any
  ): Promise<Player> {
    return new Player(
      playerEntity.username,
      playerEntity.passhash,
      playerEntity.id,
      playerEntity.opaqueId,
      playerEntity.isAdmin == SqlBool.True,
    );
  }
  dbFromDtoMany(
    _dto: DtoObject<Player>[],
    ..._more: any
  ): Promise<DBEntity<Player>[]> {
    throw new Error('Method not implemented.');
  }
  dbFromDto(_dto: DtoObject<Player>, ..._more: any): Promise<DBEntity<Player>> {
    throw new Error('Method not implemented.');
  }
  dbFromDomainMany(_obj: Player[]): Promise<DBEntity<Player>[]> {
    throw new Error('Method not implemented.');
  }
  dbFromGqlMany(
    _mod: GqlModel<Player>[],
    ..._more: any
  ): Promise<DBEntity<Player>[]> {
    throw new Error('Method not implemented.');
  }
  async gqlFromDomainMany(
    _obj: Player[],
    ..._more: any
  ): Promise<PlayerModel[]> {
    throw new Error('Method not implemented: PlayerMapper:gqlFromDomainMany');
  }

  async gqlFromDbMany(
    _ent: PlayerEntity[],
    ..._more: any
  ): Promise<GqlModel<Player>[]> {
    throw new Error('Method not implemented: PlayerMapper:gqlFromDbMany');
  }

  async domainFromDbMany(
    _ents: PlayerEntity[],
    ..._more: any
  ): Promise<Player[]> {
    throw new Error('Method not implemented: PlayerMapper:domainFromDbMany');
  }

  async dbFromGql(_mod: GqlModel<Player>): Promise<PlayerEntity> {
    throw new Error('Method not implemented: PlayerMapper:dbFromGql');
  }
}
