import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UUID } from 'crypto';

import { ChipService } from '@/features/chip/chip.service';

import { ChipSetEntityModel, CreateChipSetDto } from './chipSet.entityModel';
import { ChipSetService } from './chipSet.service';

@Resolver((of) => ChipSetEntityModel)
export class ChipSetResolver {
  constructor(
    private chipService: ChipService,
    private chipSetService: ChipSetService,
  ) {}

  @Query((returns) => ChipSetEntityModel)
  async chipSet(
    @Args('opaque_id', { type: () => String })
    opaqueId: UUID,
  ): Promise<ChipSetEntityModel> {
    return this.chipSetService.chipSet(opaqueId);
  }

  @ResolveField()
  async chips(@Parent() chipSet: ChipSetEntityModel) {
    return this.chipService.chipsForChipSet(chipSet.opaqueId);
  }

  @Mutation((returns) => ChipSetEntityModel)
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
