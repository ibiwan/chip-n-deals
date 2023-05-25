import { UUID, randomUUID } from 'crypto';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import {
  ChipEntityModel,
  CreateOrphanChipDto,
} from '@/features/chip/chip.entityModel';
import { OwnableEntityModel } from '@/auth/ownership/ownable.interface';
import { PlayerEntityModel } from '@/features/player/player.entityModel';

// combine graphql object type, domain model,
// and database entity def in one class using attributes
@Entity('chip_set')
@ObjectType('ChipSet')
export class ChipSetEntityModel implements OwnableEntityModel {
  constructor(
    name: string,
    chips: ChipEntityModel[] = null,
    owner: PlayerEntityModel = null,
  ) {
    this.name = name;

    if (chips) {
      this.chips = chips;
    }
    if (owner) {
      this.owner = owner;
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

  @ManyToOne(/* istanbul ignore next */ () => PlayerEntityModel)
  @Field(/* istanbul ignore next */ () => PlayerEntityModel)
  owner: PlayerEntityModel;
}

@InputType('CreateChipSetInput')
export class CreateChipSetDto {
  @Field()
  name: string;

  @Field(/* istanbul ignore next */ () => [CreateOrphanChipDto])
  chips: CreateOrphanChipDto[];
}

export type ChipSetRepository = Repository<ChipSetEntityModel>;
