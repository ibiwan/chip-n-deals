import { UUID } from 'crypto';

import { Field, ObjectType } from '@nestjs/graphql';

import { GqlModel } from '@/util/root.types';
import { PlayerModel } from '@/features/player/schema/player.gql.model';
import { ChipModel } from '@/features/chip';

import { ChipSetCore } from './chipSet.core';
import { ChipSet } from './chipSet.domain.object';

@ObjectType('ChipSet')
export class ChipSetModel implements ChipSetCore, GqlModel<ChipSet> {
  constructor(
    opaqueId: UUID,
    name: string,
    chips: ChipModel[] = null,
    owner: PlayerModel = null,
  ) {
    this.opaqueId = opaqueId;
    this.name = name;
    this.chips = chips;
    this.owner = owner;
  }

  @Field() opaqueId?: UUID;
  @Field() name: string;
  @Field(() => [ChipModel]) chips: ChipModel[];
  @Field(() => PlayerModel) owner: PlayerModel;

  // toDomainObject(): ChipSet {
  //   return new ChipSet(
  //     this.name,
  //     null,
  //     this.opaqueId,
  //     this.chips.map((chip) => chip.toDomainObject()),
  //     this.owner.toDomainObject(),
  //   );
  // }

  // static fromDomainObject(chipSet: ChipSet, isNested = false): ChipSetModel {
  //   const chipSetModel = new ChipSetModel(chipSet.opaqueId, chipSet.name, null);
  //   if (!isNested) {
  //     chipSetModel.chips = chipSet.chips.map((chip) =>
  //       ChipModel.fromDomainObject(chip, chipSetModel),
  //     );
  //   }
  //   return chipSetModel;
  // }
}
