import { Inject, UseInterceptors, forwardRef } from '@nestjs/common';
import { ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { Loader } from 'nestjs-dataloader';
import * as DataLoader from 'dataloader';

import { AuthorizationEntityGuard } from '@/auth/authorization/authorization.entity.guard';
import { OwnedMethod } from '@/auth/authorization/owned.decorator';

import {
  PlayerByOpaqueIdFactory,
  PlayerByOpaqueIdLoader,
  PlayerEntity,
  PlayerMapper,
  PlayerModel,
} from '@/features/player';

import {
  ChipsByChipSetOpaqueIdLoader,
  ChipEntity,
  ChipMapper,
  ChipModel,
  ChipsByChipSetOpaqueIdFactory,
} from '@/features/chip';

import { ChipSetModel } from '../schema/chipSet.gql.model';
import { Oid } from '@/types/misc.types';

// @UseInterceptors(AuthorizationEntityGuard)
@Resolver(() => ChipSetModel)
export class ChipSetFieldResolver {
  constructor(
    @Inject(forwardRef(() => PlayerMapper))
    private playerMapper: PlayerMapper,
    @Inject(forwardRef(() => ChipMapper))
    private chipMapper: ChipMapper,
  ) {}

  /**
   * @method chips GQL Field: resolve ChipSet.chips
   */
  // @ResolveField(() => Chip, {
  //   name: 'chips',
  // })
  async chips(
    @Parent() chipSet: ChipSetModel,
    @Loader(ChipsByChipSetOpaqueIdFactory)
    chipLoader: ChipsByChipSetOpaqueIdLoader,
  ): Promise<ChipModel[]> {
    console.log('chipSet.resolver.field.chips');

    const results = await chipLoader.loadMany([chipSet.opaqueId]);

    const chipEntities = results.filter(
      (item) => item instanceof ChipEntity,
    ) as ChipEntity[];

    return this.chipMapper.gqlFromDbMany(chipEntities) as Promise<ChipModel[]>;
  }

  // @ResolveField()
  async owner(
    @Parent() chipSet: ChipSetModel,
    @Loader(PlayerByOpaqueIdFactory)
    playerLoader: DataLoader<Oid, PlayerEntity>,
  ): Promise<PlayerModel> {
    console.log('chipSet.resolver.field.owner');
    const ownerEntity = await playerLoader.load(chipSet.owner.opaqueId);
    return this.playerMapper.gqlFromDb(ownerEntity);
  }
}
