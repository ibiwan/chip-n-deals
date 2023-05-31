import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';
import { Loader } from 'nestjs-dataloader';
import { UUID } from 'crypto';

import { AuthorizationEntityGuard } from '@/auth/authorization/authorization.entity.guard';
import { OwnedMethod } from '@/auth/authorization/owned.decorator';

import {
  ChipSetByIdFactory,
  ChipSetByIdLoader,
} from '../loaders/chipSet.dataLoader.id';

import { ChipSetEntity } from '../schema/chipSet.db.entity';
import { ChipSetMapper } from '../services/chipSet.mapper';
import { ChipSetModel } from '../schema/chipSet.gql.model';

import { ChipSetService } from '../services/chipSet.service';

@UseInterceptors(AuthorizationEntityGuard)
@Resolver(() => ChipSetModel)
export class ChipSetQueryResolver {
  constructor(
    private chipSetService: ChipSetService,
    private chipSetMapper: ChipSetMapper,
  ) {
    console.log({ OwnedMethod });
  }

  @Query(() => [ChipSetModel])
  async allChipSets(): Promise<ChipSetModel[]> {
    console.log('chipSet.resolver.query.allChipSets');
    const chipSets = await this.chipSetService.allChipSets();

    return this.chipSetMapper.gqlFromDomainMany(chipSets);
  }

  @Query(() => ChipSetModel)
  async chipSet(
    @Args('opaque_id', { type: () => String })
    opaqueId: UUID,
  ): Promise<ChipSetModel> {
    console.log('chipSet.resolver.query.chipSet');
    const chipSet = await this.chipSetService.chipSet(opaqueId);

    return this.chipSetMapper.gqlFromDomain(chipSet);
  }

  @Query(() => [ChipSetModel])
  async getChipSets(
    @Args({ name: 'ids', type: () => [Number] }) ids: number[],
    @Loader(ChipSetByIdFactory)
    chipSetLoader: ChipSetByIdLoader,
  ): Promise<(Error | ChipSetModel)[]> {
    console.log('chipSet.resolver.query.getChipSets');

    const results = await chipSetLoader.loadMany(ids);
    const chipSetEntities = results.filter(
      (cs) => cs instanceof ChipSetEntity,
    ) as ChipSetEntity[];

    return this.chipSetMapper.gqlFromDbMany(chipSetEntities);
  }
}
