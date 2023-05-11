import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { ChipSetEntityModel } from '../chipSet/chipSet.entityModel';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UUID } from 'crypto';

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
    (type) => ChipSetEntityModel,
    (chipSet) => chipSet.chips,
    { cascade: ["insert", "update"] },
  )
  @Field((type) => ChipSetEntityModel)
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
  @Field((type) => String)
  chipSetOpaqueId?: UUID;
}

export type ChipRepository = Repository<ChipEntityModel>;
