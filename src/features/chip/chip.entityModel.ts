import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { UUID } from 'crypto';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';

// combine graphql object type, domain model,
// and database entity def in one class using attributes
@Entity('chip')
@ObjectType('Chip')
export class ChipEntityModel {
  constructor(
    color: string,
    value: number,
    chipSet: ChipSetEntityModel = null,
  ) {
    this.color = color;
    this.value = value;

    if (chipSet) {
      this.chipSet = chipSet;
    }
  }

  @PrimaryGeneratedColumn()
  // exclude from graphql type
  id: number;

  @Column()
  @Field()
  color: string;

  @Column()
  @Field()
  value: number;

  @ManyToOne(
    /* istanbul ignore next */
    () => ChipSetEntityModel,
    /* istanbul ignore next */
    (chipSet) => chipSet.chips,
    {
      cascade: ['insert', 'update'],
    },
  )
  @Field(
    /* istanbul ignore next */
    () => ChipSetEntityModel,
  )
  chipSet: ChipSetEntityModel;
}

@InputType()
export class CreateOrphanChipDto {
  @Field()
  color: string;

  @Field()
  value: number;
}

@InputType('ChipInput')
export class CreateChipDto extends CreateOrphanChipDto {
  @Field(
    /* istanbul ignore next */
    () => String,
  )
  chipSetOpaqueId?: UUID;
}

export type ChipRepository = Repository<ChipEntityModel>;
