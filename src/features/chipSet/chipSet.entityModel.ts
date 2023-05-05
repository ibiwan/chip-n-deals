import { UUID } from 'crypto';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

import { ChipEntityModel } from '../chip/chip.entityModel';

@Entity('chip_set')
@ObjectType('ChipSet')
export class ChipSetEntityModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  opaqueId: UUID;

  @Column()
  @Field()
  name: string;

  @OneToMany((type) => ChipEntityModel, (chip) => chip.chipSet, { cascade: true })
  @Field((type)=>[ChipEntityModel])
  chips: ChipEntityModel[];
}
