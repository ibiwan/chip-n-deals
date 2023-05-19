import { UUID } from 'crypto';

import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';

import { ChipEntityModel, CreateChipDto } from './chip.entityModel';
import { ChipService } from './chip.service';

@Resolver(
  /* istanbul ignore next */
  () => ChipEntityModel,
)
export class ChipResolver {
  constructor(private chipService: ChipService) {}

  @Query(
    /* istanbul ignore next */
    () => [ChipEntityModel],
  )
  async allChips(): Promise<ChipEntityModel[]> {
    return this.chipService.allChips();
  }

  @Query(() => [ChipEntityModel])
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

  @Mutation(() => ChipEntityModel)
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
