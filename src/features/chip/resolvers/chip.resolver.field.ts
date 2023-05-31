import { ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { Loader } from 'nestjs-dataloader';
import {
  // UseInterceptors,
  forwardRef,
  Inject,
} from '@nestjs/common';

import {
  PlayerByOpaqueIdFactory,
  PlayerByOpaqueIdLoader,
  PlayerMapper,
  PlayerModel,
} from '@/features/player';

import {
  ChipSetByOpaqueIdFactory,
  ChipSetByOpaqueIdLoader,
  ChipSetMapper,
  ChipSetModel,
} from '@/features/chipSet';

import { Chip, ChipModel } from '../schema';

// @UseInterceptors(AuthorizationEntityGuard)
// @UseGuards(AuthorizationEndpointGuard)
@Resolver(() => ChipModel)
export class ChipFieldResolver {
  constructor(
    @Inject(forwardRef(() => PlayerMapper))
    private playerMapper: PlayerMapper,
    @Inject(forwardRef(() => ChipSetMapper))
    private chipSetMapper: ChipSetMapper,
  ) {}

  // @ResolveField()
  async chipSet(
    @Parent() chip: Chip,
    @Loader(ChipSetByOpaqueIdFactory)
    chipSetOpaqueLoader: ChipSetByOpaqueIdLoader,
  ): Promise<ChipSetModel> {
    console.log('chip.resolver.field.chipSet');
    const chipSetEntity = await chipSetOpaqueLoader.load(chip.chipSet.opaqueId);

    return this.chipSetMapper.gqlFromDb(chipSetEntity);
  }

  // @ResolveField()
  async owner(
    @Parent() chip: Chip,
    @Loader(PlayerByOpaqueIdFactory)
    playerLoader: PlayerByOpaqueIdLoader,
  ): Promise<PlayerModel> {
    console.log('chip.resolver.field.owner');
    const ownerEntity = await playerLoader.load(chip.owner.opaqueId);

    return this.playerMapper.gqlFromDb(ownerEntity);
  }
}
