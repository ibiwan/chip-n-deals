import { UUID } from 'crypto';
import * as _ from 'lodash';
import {
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Generated,
  Column,
  Entity,
} from 'typeorm';

import { CoreObject, DBEntity, from } from '@/types';

import { ChipSetEntity } from '@/features/chipSet';
import { PlayerEntity } from '@/features/player';

import { Chip } from './chip.domain.object';
import { ChipCore } from './chip.core';

@Entity('chip')
export class ChipEntity extends CoreObject implements ChipCore, DBEntity<Chip> {
  static from = from(() => ChipEntity.prototype);

  constructor(
    opaqueId: UUID = null,
    color: string,
    value: number,
    chipSet: ChipSetEntity = null,
    owner: PlayerEntity = null,
  ) {
    super();
    this.opaqueId = opaqueId;
    this.color = color;
    this.value = value;
    this.chipSet = chipSet;
    this.owner = owner;

    if (this.chipSet) {
      this.chipSetId = this.chipSet.id;
    }
    if (this.owner) {
      this.ownerId = this.id;
    }
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Generated('uuid')
  @Column()
  opaqueId?: UUID;
  @Column() color: string;
  @Column() value: number;

  @ManyToOne(() => ChipSetEntity, (chipSet) => chipSet.chips, {
    // cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'chipSetId' })
  chipSet: ChipSetEntity;

  @Column() chipSetId: number;

  @ManyToOne(() => PlayerEntity)
  @JoinColumn({ name: 'ownerId' })
  owner: PlayerEntity;

  @Column() ownerId: number;
}
