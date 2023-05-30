import { UUID, randomUUID } from 'crypto';
import {
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';

import { DBEntity } from '@/util/root.types';

import { ChipSetEntity } from '@/features/chipSet';
import { PlayerEntity } from '@/features/player';

import { Chip } from './chip.domain.object';
import { ChipCore } from './chip.core';

@Entity('chip')
export class ChipEntity implements ChipCore, DBEntity<Chip> {
  constructor(
    opaqueId: UUID = null,
    color: string,
    value: number,
    chipSet: ChipSetEntity = null,
    owner: PlayerEntity = null,
  ) {
    this.opaqueId = opaqueId ?? randomUUID();
    this.color = color;
    this.value = value;
    this.chipSet = chipSet;
    this.owner = owner;

    if (this.chipSet) {
      this.chipSetId = this.chipSet.id;
    }
    if (this.owner) {
      this.ownerId = this.owner.id;
    }
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column() opaqueId?: UUID;
  @Column() color: string;
  @Column() value: number;

  @ManyToOne(() => ChipSetEntity, (chipSet) => chipSet.chips, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'chipSetId' })
  chipSet: ChipSetEntity;

  @Column() chipSetId: number;

  @ManyToOne(() => PlayerEntity)
  @JoinColumn({ name: 'ownerId' })
  owner: PlayerEntity;

  @Column() ownerId: number;
}
