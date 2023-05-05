import {
  Args,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ChipSetEntityModel } from './chipSet.entityModel';
import { UUID } from 'crypto';
import { ChipSetService } from './chipSet.service';
import { ChipService } from '../chip/chip.service';

@Resolver((of) => ChipSetEntityModel)
export class ChipSetResolver {
  constructor(
    private chipService: ChipService,
    private chipSetService: ChipSetService
  ) { }

  @Query((returns) => ChipSetEntityModel)
  async chipSet(@Args('opaque_id', { type: () => String }) opaqueId: UUID) {
    return this.chipSetService.chipSet(opaqueId)
  }

  @ResolveField()
  async chips(@Parent() chipSet:ChipSetEntityModel){
    return this.chipService.chipsForChipSet(chipSet.opaqueId)
  }
}
