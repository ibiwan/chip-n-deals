import { UUID } from 'crypto';

import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { ChipService } from '@/features/chip/chip.service';

import { ChipSetEntityModel, CreateChipSetDto } from './chipSet.entityModel';
import { ChipSetService } from './chipSet.service';
import { ID_GETTER, Ownership } from '@/auth/auth.guard';
import { SetMetadata, UseInterceptors } from '@nestjs/common';

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
  async chips(@Parent() chipSet: ChipSetEntityModel) {
    return this.chipService.chipsForChipSet(chipSet.opaqueId);
  }

  /**
   * @method createChipSet GQL Mutation: create with chips
   */
  @Mutation(() => ChipSetEntityModel)
  @SetMetadata(
    ID_GETTER,
    (data: { chipSetData: CreateChipSetDto }) => data.chipSetData.name,
  )
  async createChipSet(
    @Args({
      name: 'chipSetData',
      type: () => CreateChipSetDto,
    })
    chipSetData: CreateChipSetDto,
  ): Promise<ChipSetEntityModel> {
    return this.chipSetService.create(chipSetData);
  }
}

type CreateChipSetArgs = { chipSetData };
