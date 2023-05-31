import { Resolver, Mutation, Context, Args } from '@nestjs/graphql';

import { OwnedMethod } from '@/auth/authorization/owned.decorator';

import { ChipSetService } from '@/features/chipSet';
import { PlayerEntity } from '@/features/player';

import { ChipModel, CreateChipDto } from '../schema';
import { ChipMapper, ChipService } from '../services';
import { AuthorizationEndpointGuard } from '@/auth/authorization/authorization.endpoint.guard';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthorizationEntityGuard } from '@/auth/authorization/authorization.entity.guard';

@UseInterceptors(AuthorizationEntityGuard)
// @UseGuards(AuthorizationEndpointGuard)
@Resolver(() => ChipModel)
export class ChipMutationResolver {
  constructor(
    private chipService: ChipService,
    private chipMapper: ChipMapper,
  ) {}

  @OwnedMethod({
    getParentId: (data) => data.chipData.chipSetOpaqueId,
    parentService: ChipSetService,
  })
  @Mutation(() => ChipModel)
  async createChip(
    @Args({
      name: 'chipData',
      type: () => CreateChipDto,
    })
    chipData: CreateChipDto,

    @Context() context,
  ): Promise<ChipModel> {
    console.log('chip.resolver.mutation.createChip');

    const currentUserEntity = context.req.user as PlayerEntity;
    const chip = await this.chipService.create(chipData, currentUserEntity);

    const chipModel = await this.chipMapper.gqlFromDomain(chip);
    return chipModel;
  }
}
