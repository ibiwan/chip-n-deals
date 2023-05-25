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

import { ChipService } from '@/features/chip/chip.service';
import { Ownership, Owned } from '@/auth/authorization/authz.entity.guard';
import { PlayerEntityModel } from '@/features/player/player.entityModel';
import { ChipsByChipSetIdLoader } from '@/features/chip/chip.dataLoader';
import { ChipEntityModel } from '@/features/chip/chip.entityModel';

import { ChipSetEntityModel, CreateChipSetDto } from './chipSet.entityModel';
import { ChipSetService } from './chipSet.service';
import { ChipSetLoader } from './chipSet.dataLoader';

@UseInterceptors(Ownership)
@Resolver(() => ChipSetEntityModel)
export class ChipSetResolver {
  constructor(
    private chipService: ChipService,
    private chipSetService: ChipSetService,
  ) {}

  /**
   * @method allChipSets GQL Query: all, with chips
   */
  @Query(() => [ChipSetEntityModel])
  async allChipSets(): Promise<ChipSetEntityModel[]> {
    return this.chipSetService.allChipSets();
  }

  /**
   * @method chipSet GQL Query: fetch one by opaqueId
   */
  @Query(() => ChipSetEntityModel)
  async chipSet(
    @Args('opaque_id', { type: () => String })
    opaqueId: UUID,
  ): Promise<ChipSetEntityModel> {
    return this.chipSetService.chipSet(opaqueId);
  }

  /**
   * @method chips GQL Field: resolve ChipSet.chips
   */
  @ResolveField()
  async chips(
    @Parent() chipSet: ChipSetEntityModel,
    @Loader(ChipsByChipSetIdLoader)
    chipLoader: DataLoader<ChipEntityModel['id'], ChipEntityModel>,
  ) {
    return chipLoader.load(chipSet.id);
  }

  @Query(() => [ChipEntityModel])
  async getChipSets(
    @Args({ name: 'ids', type: () => [Number] }) ids: number[],
    @Loader(ChipSetLoader)
    chipSetLoader: DataLoader<ChipSetEntityModel['id'], ChipSetEntityModel>,
  ): Promise<(Error | ChipSetEntityModel)[]> {
    return chipSetLoader.loadMany(ids);
  }

  /**
   * @method createChipSet GQL Mutation: create with chips
   */
  @Mutation(() => ChipSetEntityModel)
  @Owned({
    getTargetId: (data) => data.chipSetData.id,
    targetService: ChipSetService,
  })
  async createChipSet(
    @Args({
      name: 'chipSetData',
      type: () => CreateChipSetDto,
    })
    chipSetData: CreateChipSetDto,

    @Context() context,
  ): Promise<ChipSetEntityModel> {
    const currentUser = context.req.user as PlayerEntityModel;

    return this.chipSetService.create(chipSetData, currentUser);
  }
}
