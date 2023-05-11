import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UUID } from 'crypto';

import { ChipEntityModel, CreateChipDto } from './chip.entityModel';
import { ChipService } from './chip.service';
import { ChipSetEntityModel } from '../chipSet/chipSet.entityModel';

@Resolver((of) => ChipEntityModel)
export class ChipResolver {
  constructor(private chipService: ChipService) { }

  @Query((returns) => [ChipEntityModel])
  async allChips(): Promise<ChipEntityModel[]> {
    return this.chipService.allChips();
  }

  @Query((returns) => [ChipEntityModel])
  async chipsForChipSet(
    @Args('chipset_opaque_id', { type: () => String })
    opaqueId: UUID,
  ): Promise<ChipEntityModel[]> {
    return this.chipService.chipsForChipSet(opaqueId);
  }

  @ResolveField()
  async chipSet(@Parent() chip: ChipEntityModel): Promise<ChipSetEntityModel> {
    return chip.chipSet;
  }

  @Mutation((returns) => ChipEntityModel)
  async createChip(
    @Args({
      name: 'chipData',
      type: () => CreateChipDto,
    })
    chipData: CreateChipDto,
  ): Promise<ChipEntityModel> {
    return this.chipService.create(chipData);
  }



}
