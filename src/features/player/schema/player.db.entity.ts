import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { UUID } from 'crypto';

import { SqlBool } from '@/util/sqlite.util';
import { DBEntity } from '@/types';

import { Player } from './player.domain.object';
import { PlayerCore } from './player.core';

@Entity('player')
export class PlayerEntity implements PlayerCore, DBEntity<Player> {
  constructor(username: string, passhash: string = null) {
    this.username = username;
    this.passhash = passhash;
    this.opaqueId = null;
  }

  @PrimaryGeneratedColumn() id?: number;
  @Generated('uuid')
  @Column()
  opaqueId?: UUID;
  @Column() username: string;
  @Column() passhash: string;
  @Column() isAdmin: number = SqlBool.False;
}
