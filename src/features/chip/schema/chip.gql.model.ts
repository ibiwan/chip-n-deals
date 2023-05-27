import { UUID, randomUUID } from 'crypto';

import { Field, ObjectType } from '@nestjs/graphql';

import { GqlModel } from '@/util/root.types';

import { ChipSetModel } from '@/features/chipSet/schema/chipSet.gql.model';
import { PlayerModel } from '@/features/player/schema/player.gql.model';

import { Chip } from './chip.domain.object';
import { ChipCore } from './chip.core';

@ObjectType('Chip')
export class ChipModel implements ChipCore, GqlModel<Chip> {
  constructor(
    color: string,
    value: number,
    chipSet: ChipSetModel = null,
    owner: PlayerModel = null,
  ) {
    this.opaqueId = randomUUID();
    this.color = color;
    this.value = value;
    this.chipSet = chipSet;
    this.owner = owner;
  }

  @Field() opaqueId?: UUID;
  @Field() color: string;
  @Field() value: number;
  @Field(() => ChipSetModel) chipSet: ChipSetModel;
  @Field(() => PlayerModel) owner: PlayerModel;

  static fromDomainObject(chip: Chip): ChipModel {
    return new ChipModel(
      chip.color,
      chip.value,
      ChipSetModel.fromDomainObject(chip.chipSet),
      PlayerModel.fromDomainObject(chip.owner),
    );
  }

  toDomainObject(): Chip {
    throw new Error('Method not implemented.');
  }
}
