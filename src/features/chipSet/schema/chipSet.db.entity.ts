import { UUID } from 'crypto';
import {
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
  Entity,
  Column,
  Generated,
} from 'typeorm';

import { DBEntity, from } from '@/types';

import { PlayerEntity } from '@/features/player';
import { ChipEntity } from '@/features/chip';

import { ChipSet } from './chipSet.domain.object';
import { ChipSetCore } from './chipSet.core';

@Entity('chip_set')
export class ChipSetEntity implements ChipSetCore, DBEntity<ChipSet> {
  static from = from(() => ChipSetEntity.prototype);

  constructor(
    opaqueId: UUID = null,
    name: string,
    chips: ChipEntity[] = null,
    owner: PlayerEntity = null,
  ) {
    this.opaqueId = opaqueId;
    this.name = name;
    this.chips = chips;
    this.owner = owner;

    if (this.owner) {
      this.ownerId = this.owner.id;
    }
  }

  // static from(
  //   source: ChipSetMeta,
  //   fields: Record<string, any> = {},
  // ): ChipSetEntity {
  //   const chipSetEntity = Object.create(ChipSetEntity.prototype);
  //   Object.assign(chipSetEntity, source, fields);

  //   return chipSetEntity;
  // }

  @PrimaryGeneratedColumn() id?: number;

  @Generated('uuid')
  @Column()
  opaqueId?: UUID;

  @Column() name: string;

  @OneToMany(() => ChipEntity, (chip: ChipEntity) => chip.chipSet, {
    // cascade: ['insert', 'update'],
  })
  chips: ChipEntity[];

  @ManyToOne(() => PlayerEntity)
  @JoinColumn({ name: 'ownerId' })
  owner: PlayerEntity;

  @Column() ownerId: number;
}
