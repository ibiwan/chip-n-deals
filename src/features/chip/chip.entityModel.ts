import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { UUID, randomUUID } from 'crypto';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { PlayerEntityModel } from '@/features/player/player.entityModel';
import { OwnableEntityModel } from '@/auth/ownership/ownable.interface';

// combine graphql object type, domain model,
// and database entity def in one class using attributes
@Entity('chip')
@ObjectType('Chip')
export class ChipEntityModel implements OwnableEntityModel {
  constructor(
    color: string,
    value: number,
    chipSet: ChipSetEntityModel = null,
    owner: PlayerEntityModel = null,
  ) {
    this.color = color;
    this.value = value;

    if (chipSet) {
      this.chipSet = chipSet;
    }
    if (owner) {
      this.owner = owner;
    }

    this.opaqueId = randomUUID();
  }

  @PrimaryGeneratedColumn()
  // exclude from graphql type
  id: number;

  @Column()
  @Field()
  opaqueId?: UUID;

  @Column()
  @Field()
  color: string;

  @Column()
  @Field()
  value: number;

  @ManyToOne(
    /* istanbul ignore next */ () => ChipSetEntityModel,
    /* istanbul ignore next */ (chipSet) => chipSet.chips,
    { cascade: ['insert', 'update'] },
  )
  @JoinColumn({ name: 'chipSetId' })
  @Field(/* istanbul ignore next */ () => ChipSetEntityModel)
  chipSet: ChipSetEntityModel;

  @Column()
  chipSetId: number;

  @ManyToOne(/* istanbul ignore next */ () => PlayerEntityModel)
  @Field(/* istanbul ignore next */ () => PlayerEntityModel)
  owner: PlayerEntityModel;
}

@InputType()
export class CreateOrphanChipDto {
  @Field()
  color: string;

  @Field()
  value: number;
}

@InputType('CreateChipInput')
export class CreateChipDto extends CreateOrphanChipDto {
  @Field(/* istanbul ignore next */ () => String)
  chipSetOpaqueId?: UUID;
}

export type ChipRepository = Repository<ChipEntityModel>;
