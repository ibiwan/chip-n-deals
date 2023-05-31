import { UseInterceptors } from '@nestjs/common';
import { Resolver, Mutation, Context, Args } from '@nestjs/graphql';

import { AuthorizationEntityGuard } from '@/auth/authorization/authorization.entity.guard';
import { OwnedMethod } from '@/auth/authorization/owned.decorator';

import { PlayerEntity } from '@/features/player';

import { ChipSetService } from '../services/chipSet.service';

import { ChipSet } from '../schema/chipSet.domain.object';
import { ChipSetMapper } from '../services/chipSet.mapper';
import { ChipSetModel } from '../schema/chipSet.gql.model';
import { CreateChipSetDto } from '../schema/chipSet.gql.dto.create';

@UseInterceptors(AuthorizationEntityGuard)
@Resolver(() => ChipSetModel)
export class ChipSetMutationResolver {
  constructor(
    private chipSetService: ChipSetService,
    private chipSetMapper: ChipSetMapper,
  ) {
    console.log({ OwnedMethod });
  }

  /**
   * @method createChipSet GQL Mutation: create with chips
   */
  @OwnedMethod({
    getTargetId: (data) => data.chipSetData.id,
    targetService: ChipSetService,
  })
  @Mutation(() => ChipSetModel, { name: 'createChipSet' })
  async createChipSet(
    @Args({
      name: 'chipSetData',
      type: () => CreateChipSetDto,
    })
    chipSetData: CreateChipSetDto,

    @Context() context,
  ): Promise<ChipSetModel> {
    console.log('chipSet.resolver.mutation.createChipSet');
    const currentUserEntity: PlayerEntity = context.req.user;

    const chipSet: ChipSet = await this.chipSetService.create(
      chipSetData as CreateChipSetDto,
      currentUserEntity,
    );

    const chipSetModel = await this.chipSetMapper.gqlFromDomain(chipSet);
    return chipSetModel;
  }
}
