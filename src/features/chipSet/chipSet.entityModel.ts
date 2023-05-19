import { UUID, randomUUID } from 'crypto';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import {
  ChipEntityModel,
  CreateOrphanChipDto,
} from '@/features/chip/chip.entityModel';

// combine graphql object type, domain model,
// and database entity def in one class using attributes
@Entity('chip_set')
@ObjectType('ChipSet')
export class ChipSetEntityModel {
  constructor(name: string, chips: ChipEntityModel[] = null) {
    this.name = name;
    if (chips) {
      this.chips = chips;
    }
    this.opaqueId = randomUUID();
  }

  @PrimaryGeneratedColumn()
  // exclude from graphql type
  id?: number;

  @Column()
  @Field()
  opaqueId?: UUID;

  @Column()
  @Field()
  name: string;

  @OneToMany(
    /* istanbul ignore next */ () => ChipEntityModel,
    /* istanbul ignore next */ (chip) => chip.chipSet,
    {
      cascade: ['insert', 'update'],
    },
  )
  @Field(/* istanbul ignore next */ () => [ChipEntityModel])
  chips: ChipEntityModel[];
}

@InputType('CreateChipSetInput')
export class CreateChipSetDto {
  @Field()
  name: string;

  @Field(/* istanbul ignore next */ () => [CreateOrphanChipDto])
  chips: CreateOrphanChipDto[];
}

export type ChipSetRepository = Repository<ChipSetEntityModel>;
