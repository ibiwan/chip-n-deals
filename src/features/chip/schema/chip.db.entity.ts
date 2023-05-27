import {
  PrimaryGeneratedColumn,
  JoinColumn,
  Repository,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';
import { UUID, randomUUID } from 'crypto';

import { ChipSetEntity } from '@/features/chipSet/schema/chipSet.db.entity';
import { ChipSet } from '@/features/chipSet/schema/chipSet.domain.object';
import { PlayerEntity } from '@/features/player/schema/player.db.entity';
import { DBEntity } from '@/util/root.types';

import { Chip } from './chip.domain.object';
import { ChipCore } from './chip.core';

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

  static fromDomainObject(
    chip: Chip,
    chipSetEntity: ChipSetEntity = null,
  ): ChipEntity {
    return new ChipEntity(
      chip.opaqueId,
      chip.color,
      chip.value,
      chipSetEntity ?? ChipSetEntity.fromDomainObject(chip.chipSet, true),
      PlayerEntity.fromDomainObject(chip.owner),
    );
  }

  toDomainObject(chipSet: ChipSet = null): Chip {
    return new Chip(
      this.color,
      this.value,
      this.id,
      this.opaqueId,
      chipSet ?? this.chipSet.toDomainObject(true),
      this.owner?.toDomainObject(),
    );
  }
}

export type ChipRepository = Repository<ChipEntity>;
