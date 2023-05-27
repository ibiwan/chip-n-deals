import { UUID, randomUUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';

import { SqlBool } from '@/datasource/sqlite.util';
import { Player } from './player.domain.object';
import { PlayerCore } from './player.core';
import { DBEntity } from '@/util/root.types';

@Entity('player')
export class PlayerEntity implements PlayerCore, DBEntity<Player> {
  constructor(username: string, passhash: string = null) {
    this.username = username;
    this.passhash = passhash;
    this.opaqueId = randomUUID();
  }

  @PrimaryGeneratedColumn()
  id?: number;
  @Column() opaqueId?: UUID;
  @Column() username: string;
  @Column() passhash: string;
  @Column() isAdmin: number = SqlBool.False;

  static fromDomainObject(player: Player): PlayerEntity {
    const playerEntity = new PlayerEntity(player.opaqueId, player.username);
    if (player.isAdmin) {
      playerEntity.isAdmin = SqlBool.True;
    }
    return playerEntity;
  }

  toDomainObject(): Player {
    const player = new Player(
      this.username,
      this.passhash,
      this.id,
      this.opaqueId,
      this.isAdmin == SqlBool.True,
    );
    return player;
  }
}

export type PlayerRepository = Repository<PlayerEntity>;
