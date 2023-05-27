import { randomUUID, UUID } from 'crypto';
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
    opaqueId: UUID = null,
    name: string,
    chips: ChipEntity[] = null,
    owner: PlayerEntity = null,
  ) {
    console.log('chipsetentity constructor', { owner });

    this.opaqueId = opaqueId ?? randomUUID();
    this.name = name;
    this.chips = chips;
    this.owner = owner;
    console.log({ owner, thisowner: this.owner });

    if (this.owner) {
      console.log('setting ownerid', this.owner.id);
      this.ownerId = this.owner.id;
      console.log('set', this.ownerId);
    }

    console.log('this', this);
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

  static fromDomainObject(chipSet: ChipSet, isNested = false): ChipSetEntity {
    const owner = PlayerEntity.fromDomainObject(chipSet.owner);
    console.log({ owner });
    const chipSetEntity: ChipSetEntity = new ChipSetEntity(
      chipSet.opaqueId,
      chipSet.name,
      null,
      owner,
    );
    console.log({ chipSet, chipSetEntity, isNested });
    if (!isNested) {
      chipSetEntity.chips = chipSet.chips.map((chip: Chip) => {
        console.log({ chip });
        return ChipEntity.fromDomainObject(chip, chipSetEntity);
      });
      console.log({ chipSetEntity });
    }
    return chipSetEntity;
  }

  toDomainObject(isNested = false): ChipSet {
    const chipSet: ChipSet = new ChipSet(
      this.name,
      this.id,
      this.opaqueId,
      null,
      this.owner?.toDomainObject(),
    );
    if (!isNested) {
      chipSet.chips = this.chips?.map((chipEntity: ChipEntity) =>
        chipEntity.toDomainObject(chipSet),
      );
    }
    return chipSet;
  }
}

export type ChipSetRepository = Repository<ChipSetEntity>;
