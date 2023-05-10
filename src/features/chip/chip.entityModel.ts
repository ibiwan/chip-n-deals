import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import {  ChipSetEntityModel } from '../chipSet/chipSet.entityModel';
import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'crypto';

@Entity('chip')
@ObjectType('Chip')
export class ChipEntityModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field((type)=>String)
  color: string;

  @Column()
  @Field()
  value: number;

  @ManyToOne((type) => ChipSetEntityModel, (chipSet) => chipSet.chips)
  @Field((type) => ChipSetEntityModel)
  chipSet: ChipSetEntityModel;
}

export class CreateChipDto {
  color: string;
  value: number;
  chipSetOpaqueId: UUID;
}
