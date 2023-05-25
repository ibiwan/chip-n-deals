import { UUID } from 'crypto';
import * as DataLoader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { Owned, Ownership } from '@/auth/authorization/authz.entity.guard';
import { PlayerEntityModel } from '@/features/player/player.entityModel';
import { ChipSetService } from '@/features/chipSet/chipSet.service';
import { ChipSetLoader } from '@/features/chipSet/chipSet.dataLoader';

import { ChipEntityModel, CreateChipDto } from './chip.entityModel';
import { ChipService } from './chip.service';
import { ChipsByChipIdLoader } from './chip.dataLoader';

@UseInterceptors(Ownership)
// @UseGuards(AuthGuard)
@Resolver(/* istanbul ignore next */ () => ChipEntityModel)
export class ChipResolver {
  constructor(
    private chipService: ChipService,
    private chipSetService: ChipSetService,
  ) {}

  @Query(/* istanbul ignore next */ () => [ChipEntityModel])
  async allChips(): Promise<ChipEntityModel[]> {
    return this.chipService.allChips();
  }

  @Query(() => [ChipEntityModel])
  async chipsForChipSet(
    @Args('chipset_opaque_id', { type: () => String })
    opaqueId: UUID,
  ): Promise<ChipEntityModel[]> {
    const chipSet = await this.chipSetService.chipSet(opaqueId);
    return this.chipService.chipsForChipSet(chipSet.id);
  }

  @ResolveField()
  async chipSet(
    @Parent() chip: ChipEntityModel,
    @Loader(ChipSetLoader)
    chipSetLoader: DataLoader<ChipSetEntityModel['id'], ChipSetEntityModel>,
  ): Promise<ChipSetEntityModel> {
    return chipSetLoader.load(chip.chipSetId);
  }

  @Query(() => [ChipEntityModel])
  async getChips(
    @Args({ name: 'ids', type: () => [Number] }) ids: number[],
    @Loader(ChipsByChipIdLoader)
    chipLoader: DataLoader<ChipEntityModel['id'], ChipEntityModel>,
  ): Promise<(Error | ChipEntityModel)[]> {
    return chipLoader.loadMany(ids);
  }

  @Mutation(() => ChipEntityModel)
  @Owned({
    getParentId: (data) => data.chipData.chipSetOpaqueId,
    parentService: ChipSetService,
  })
  async createChip(
    @Args({
      name: 'chipData',
      type: () => CreateChipDto,
    })
    chipData: CreateChipDto,

    @Context() context,
  ): Promise<ChipEntityModel> {
    const currentUser = context.req.user as PlayerEntityModel;

    return this.chipService.create(chipData, currentUser);
  }
}
