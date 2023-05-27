import { UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';

import { DBEntity } from '@/util/root.types';

import { ChipEntity } from '@/features/chip/schema/chip.db.entity';

import { ChipSetCore } from './chipset.core';
import { ChipSet } from './chipSet.domain.object';
import { Chip } from '@/features/chip/schema/chip.domain.object';
import { PlayerEntity } from '@/features/player/schema/player.db.entity';

export interface ChipSetDbRow extends ChipSetCore {
  id: number;
  opaqueId: UUID;
  name: string;
  ownerId: number;
}

@Entity('chip_set')
export class ChipSetEntity implements ChipSetCore, DBEntity<ChipSet> {
  constructor(
    opaqueId: UUID,
    name: string,
    chips: ChipEntity[] = null,
    owner: PlayerEntity = null,
  ) {
    this.opaqueId = opaqueId;
    this.name = name;
    this.chips = chips;
    this.owner = owner;
  }

  @PrimaryGeneratedColumn() id?: number;
  @Column() opaqueId?: UUID;
  @Column() name: string;

  @OneToMany(() => ChipEntity, (chip: ChipEntity) => chip.chipSet, {
    cascade: ['insert', 'update'],
  })
  chips: ChipEntity[];

  @ManyToOne(() => PlayerEntity)
  @JoinColumn({ name: 'ownerId' })
  owner: PlayerEntity;

  @Column() ownerId: number;

  static fromDomainObject(chipSet: ChipSet): ChipSetEntity {
    return new ChipSetEntity(
      chipSet.opaqueId,
      chipSet.name,
      chipSet.chips.map((chip: Chip) => ChipEntity.fromDomainObject(chip)),
      PlayerEntity.fromDomainObject(chipSet.owner),
    );
  }

  toDomainObject(): ChipSet {
    return new ChipSet(
      this.name,
      this.id,
      this.opaqueId,
      this.chips.map((chipEntity: ChipEntity) => chipEntity.toDomainObject()),
      this.owner.toDomainObject(),
    );
  }
}

export type ChipSetRepository = Repository<ChipSetEntity>;
