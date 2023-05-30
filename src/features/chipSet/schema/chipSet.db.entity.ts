import { randomUUID, UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DBEntity } from '@/util/root.types';

import { PlayerEntity } from '@/features/player';
import { ChipEntity } from '@/features/chip';

import { ChipSet } from './chipSet.domain.object';
import { ChipSetCore } from './chipSet.core';

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

  // static fromDomainObject(chipSet: ChipSet, isNested = false): ChipSetEntity {
  //   const owner = PlayerEntity.fromDomainObject(chipSet.owner);
  //   console.log({ owner });
  //   const chipSetEntity: ChipSetEntity = new ChipSetEntity(
  //     chipSet.opaqueId,
  //     chipSet.name,
  //     null,
  //     owner,
  //   );
  //   console.log({ chipSet, chipSetEntity, isNested });
  //   if (!isNested) {
  //     chipSetEntity.chips = chipSet.chips.map((chip: Chip) => {
  //       console.log({ chip });
  //       return ChipEntity.fromDomainObject(chip, chipSetEntity);
  //     });
  //     console.log({ chipSetEntity });
  //   }
  //   return chipSetEntity;
  // }

  // async toDomainObject(
  //   isNested = false,
  //   playerService: PlayerService,
  // ): Promise<ChipSet> {
  //   console.log({ playerService });
  //   let owner;
  //   if (this.ownerId !== null && this.owner == null) {
  //     owner = await playerService.playerById(this.ownerId);
  //   } else {
  //     owner = this.owner?.toDomainObject();
  //   }
  //   const chipSet: ChipSet = new ChipSet(
  //     this.name,
  //     this.id,
  //     this.opaqueId,
  //     null,
  //     owner,
  //   );
  //   if (!isNested) {
  //     chipSet.chips = await Promise.all(
  //       this.chips?.map((chipEntity: ChipEntity) =>
  //         chipEntity.toDomainObject(chipSet, playerService),
  //       ),
  //     );
  //   }
  //   return chipSet;
  // }
}

// export type ChipSetRepository = Repository<ChipSetEntity>;
