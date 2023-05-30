import { Field, ObjectType } from '@nestjs/graphql';
import { UUID, randomUUID } from 'crypto';

import { GqlModel } from '@/util/root.types';

import { ChipSetModel } from '@/features/chipSet';
import { PlayerModel } from '@/features/player';

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

  // static fromDomainObject(
  //   chip: Chip,
  //   chipSetModel: ChipSetModel = null,
  // ): ChipModel {
  //   return new ChipModel(
  //     chip.color,
  //     chip.value,
  //     chipSetModel ?? ChipSetModel.fromDomainObject(chip.chipSet, true),
  //     PlayerModel.fromDomainObject(chip.owner),
  //   );
  // }
}
