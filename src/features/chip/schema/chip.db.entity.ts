import {
  PrimaryGeneratedColumn,
  JoinColumn,
  Repository,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';
import { UUID } from 'crypto';

import { DBEntity } from '@/util/root.types';

import { ChipSetEntity } from '@/features/chipSet/schema/chipSet.db.entity';

import { ChipCore } from './chip.core';
import { Chip } from './chip.domain.object';
import { PlayerEntity } from '@/features/player/schema/player.db.entity';

export interface ChipDbRow extends ChipCore {
  id: number;
  opaqueId: UUID;
  color: string;
  value: number;
  chipSetId: number;
  ownerId: number;
}

@Entity('chip')
export class ChipEntity implements ChipCore, DBEntity<Chip> {
  constructor(
    opaqueId: UUID,
    color: string,
    value: number,
    chipSet: ChipSetEntity = null,
    owner: PlayerEntity = null,
  ) {
    this.opaqueId = opaqueId;
    this.color = color;
    this.value = value;
    this.chipSet = chipSet;
    this.owner = owner;
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

  static fromDomainObject(chip: Chip): ChipEntity {
    return new ChipEntity(
      chip.opaqueId,
      chip.color,
      chip.value,
      ChipSetEntity.fromDomainObject(chip.chipSet),
      PlayerEntity.fromDomainObject(chip.owner),
    );
  }

  toDomainObject(): Chip {
    return new Chip(
      this.color,
      this.value,
      this.id,
      this.opaqueId,
      this.chipSet.toDomainObject(),
      this.owner.toDomainObject(),
    );
  }
}

export type ChipRepository = Repository<ChipEntity>;
