import { UUID, randomUUID } from 'crypto';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { ChipEntityModel } from '@/features/chip/chip.entityModel';

// combine graphql object type, domain model, 
// and database entity def in one class using attributes
@Entity('chip_set')
@ObjectType('ChipSet')
export class ChipSetEntityModel {
  constructor(
    name: string,
    chips: ChipEntityModel[] = null
  ) {
    this.name = name
    if (chips) {
      this.chips = chips
    }
    this.opaqueId = randomUUID()
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field()
  opaqueId?: UUID;

  @Column()
  @Field()
  name: string;

  @OneToMany(
    (type) => ChipEntityModel,
    (chip) => chip.chipSet,
    { cascade: true }
  )
  @Field((type) => [ChipEntityModel])
  chips: ChipEntityModel[];
}

// "create" object has to differ slightly but is closely related to combined type
export class CreateChipSetDto {
  name: string;
}
