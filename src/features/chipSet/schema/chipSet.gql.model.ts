import { Field, ObjectType } from '@nestjs/graphql';
import { UUID } from 'crypto';

import { GqlModel } from '@/types';

import { PlayerModel } from '@/features/player/schema/player.gql.model';
import { ChipModel } from '@/features/chip';

import { ChipSet } from './chipSet.domain.object';
import { ChipSetCore } from './chipSet.core';

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
}
