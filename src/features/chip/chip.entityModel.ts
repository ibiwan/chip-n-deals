import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import {  ChipSetEntityModel } from '../chipSet/chipSet.entityModel';
import { Field, Int, ObjectType } from '@nestjs/graphql';

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
