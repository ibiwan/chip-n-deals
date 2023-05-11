import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ChipSetEntityModel } from '../chipSet/chipSet.entityModel';
import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'crypto';

// combine graphql object type, domain model, 
// and database entity def in one class using attributes
@Entity('chip')
@ObjectType('Chip')
export class ChipEntityModel {
  constructor(
    color: string,
    value: number,
    chipSet: ChipSetEntityModel
  ) {
    this.color = color
    this.value = value
    if (chipSet) {
      this.chipSet = chipSet
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field((type) => String)
  color: string;

  @Column()
  @Field()
  value: number;

  @ManyToOne(
    (type) => ChipSetEntityModel,
    (chipSet) => chipSet.chips
  )
  @Field((type) => ChipSetEntityModel)
  chipSet: ChipSetEntityModel;
}

// "create" object has to differ slightly but is closely related to combined type
export class CreateChipDto {
  color: string;
  value: number;
  chipSetOpaqueId: UUID;
}
