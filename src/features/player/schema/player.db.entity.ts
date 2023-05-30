import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UUID, randomUUID } from 'crypto';

import { SqlBool } from '@/datasource/sqlite.util';
import { DBEntity } from '@/util/root.types';

import { Player } from './player.domain.object';
import { PlayerCore } from './player.core';

@Entity('player')
export class PlayerEntity implements PlayerCore, DBEntity<Player> {
  constructor(username: string, passhash: string = null) {
    this.username = username;
    this.passhash = passhash;
    this.opaqueId = randomUUID();
  }

  @PrimaryGeneratedColumn() id?: number;
  @Column() opaqueId?: UUID;
  @Column() username: string;
  @Column() passhash: string;
  @Column() isAdmin: number = SqlBool.False;

  // static fromDomainObject(player: Player): PlayerEntity {
  //   const playerEntity = new PlayerEntity(player.username, player.passhash);
  //   playerEntity.id = player.id;
  //   if (player.isAdmin) {
  //     playerEntity.isAdmin = SqlBool.True;
  //   }
  //   return playerEntity;
  // }

  // toDomainObject(): Player {
  //   const player = new Player(
  //     this.username,
  //     this.passhash,
  //     this.id,
  //     this.opaqueId,
  //     this.isAdmin == SqlBool.True,
  //   );
  //   return player;
  // }
}

// export type PlayerRepository = Repository<PlayerEntity>;
