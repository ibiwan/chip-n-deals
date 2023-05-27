import { UUID } from 'crypto';

import { Field, ObjectType } from '@nestjs/graphql';

import { GqlModel } from '@/util/root.types';

import { ChipModel } from '@/features/chip/schema/chip.gql.model';
import { ChipSetCore } from './chipset.core';
import { ChipSet } from './chipSet.domain.object';
import { PlayerModel } from '@/features/player/schema/player.gql.model';

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

  toDomainObject(): ChipSet {
    return new ChipSet(
      this.name,
      null,
      this.opaqueId,
      this.chips.map((chip) => chip.toDomainObject()),
      this.owner.toDomainObject(),
    );
  }

  static fromDomainObject(chipSet: ChipSet): ChipSetModel {
    return new ChipSetModel(
      chipSet.opaqueId,
      chipSet.name,
      chipSet.chips.map((chip) => ChipModel.fromDomainObject(chip)),
      PlayerModel.fromDomainObject(chipSet.owner),
    );
  }
}
