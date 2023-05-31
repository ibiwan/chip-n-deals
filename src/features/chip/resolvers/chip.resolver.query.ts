import { Resolver, Query, Args } from '@nestjs/graphql';
import { Loader } from 'nestjs-dataloader';
import { UUID } from 'crypto';

import { OwnedMethod } from '@/auth/authorization/owned.decorator';

import { ChipModel, Chip, ChipEntity } from '../schema';
import { ChipService, ChipMapper } from '../services';
import { ChipsByChipIdFactory, ChipsByChipIdLoader } from '../loaders/';

// @UseInterceptors(AuthorizationEntityGuard)
// @UseGuards(AuthorizationEndpointGuard)
@Resolver(() => ChipModel)
export class ChipQueryResolver {
  constructor(
    private chipService: ChipService,
    private chipMapper: ChipMapper,
  ) {
    console.log({ OwnedMethod });
  }

  @Query(() => [ChipModel])
  async allChips(): Promise<ChipModel[]> {
    console.log('chip.resolver.query.allChips');

    const chips = await this.chipService.allChips();

    return this.chipMapper.gqlFromDomainMany(chips);
  }

  @Query(() => [ChipModel])
  async chipsForChipSet(
    @Args('chipset_opaque_id', { type: () => String })
    opaqueId: UUID,
  ): Promise<ChipModel[]> {
    console.log('chip.resolver.query.chipsForChipSet');
    const chips = await this.chipService.chipsForChipSetsByOpaqueIds([
      opaqueId,
    ]);

    return this.chipMapper.gqlFromDomainMany(chips);
  }

  @Query(() => [ChipModel])
  async getChips(
    @Args({ name: 'ids', type: () => [Number] }) ids: number[],
    @Loader(ChipsByChipIdFactory)
    chipLoader: ChipsByChipIdLoader,
  ): Promise<(Error | ChipModel)[]> {
    console.log('chip.resolver.query.getChips');
    const chipEntityMaybes = await chipLoader.loadMany(ids);
    const chipEntities = chipEntityMaybes.filter(
      (c) => c instanceof Chip,
    ) as ChipEntity[];

    return this.chipMapper.gqlFromDbMany(chipEntities);
  }
}
