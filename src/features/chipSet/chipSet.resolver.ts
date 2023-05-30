import { Inject, UseInterceptors, forwardRef } from '@nestjs/common';
import { Loader } from 'nestjs-dataloader';
import { UUID } from 'crypto';
import {
  ResolveField,
  Resolver,
  Mutation,
  Context,
  Parent,
  Query,
  Args,
} from '@nestjs/graphql';

import { EntityGuard } from '@/auth/authorization/authz.entity.guard';
import { OwnedMethod } from '@/auth/authorization/owned.decorator';

import {
  PlayerDataByOpaqueIdLoader,
  PlayerByOpaqueIdLoader,
  PlayerDataByIdLoader,
  PlayerByIdLoader,
  PlayerMapper,
  PlayerModel,
  Player,
} from '@/features/player';

import {
  ChipsByChipSetOpaqueIdLoader,
  ChipOpaqueDataLoader,
  ChipEntity,
  ChipMapper,
  ChipModel,
} from '@/features/chip';

import { ChipSetDataLoader, ChipSetByIdLoader } from './loaders';
import {
  CreateChipSetDto,
  ChipSetEntity,
  ChipSetMapper,
  ChipSetModel,
  ChipSet,
} from './schema';
import { ChipSetService } from './chipSet.service';
import { ChipSetModule } from '.';

@UseInterceptors(EntityGuard)
@Resolver(() => ChipSetModel)
export class ChipSetResolver {
  constructor(
    @Inject(forwardRef(() => PlayerMapper))
    private playerMapper: PlayerMapper,
    @Inject(forwardRef(() => ChipMapper))
    private chipMapper: ChipMapper,

    private chipSetService: ChipSetService,
    private chipSetMapper: ChipSetMapper,
  ) {
    console.log({ OwnedMethod });
  }

  @Query(() => [ChipSetModel])
  async allChipSets(): Promise<ChipSetModel[]> {
    const chipSets = await this.chipSetService.allChipSets();

    return this.chipSetMapper.gqlFromDomainMany(chipSets);
  }

  @Query(() => ChipSetModel)
  async chipSet(
    @Args('opaque_id', { type: () => String })
    opaqueId: UUID,
  ): Promise<ChipSetModel> {
    const chipSet = await this.chipSetService.chipSet(opaqueId);

    return this.chipSetMapper.gqlFromDomain(chipSet);
  }

  /**
   * @method chips GQL Field: resolve ChipSet.chips
   */
  @ResolveField()
  async chips(
    @Parent() chipSet: ChipSetModel,
    @Loader(ChipsByChipSetOpaqueIdLoader)
    chipLoader: ChipOpaqueDataLoader,
  ): Promise<ChipModel[]> {
    const results = await chipLoader.loadMany([chipSet.opaqueId]);

    const chipEntities = results.filter(
      (item) => item instanceof ChipEntity,
    ) as ChipEntity[];

    return this.chipMapper.gqlFromDbMany(chipEntities) as Promise<ChipModel[]>;
  }

  @ResolveField()
  async owner(
    @Parent() chipSet: ChipSetModel,
    @Loader(PlayerByOpaqueIdLoader)
    playerLoader: PlayerDataByOpaqueIdLoader,
  ): Promise<PlayerModel> {
    const ownerEntity = await playerLoader.load(chipSet.owner.opaqueId);
    return this.playerMapper.gqlFromDb(ownerEntity);
  }

  @Query(() => [ChipSetModel])
  async getChipSets(
    @Args({ name: 'ids', type: () => [Number] }) ids: number[],
    @Loader(ChipSetByIdLoader)
    chipSetLoader: ChipSetDataLoader,
  ): Promise<(Error | ChipSetModel)[]> {
    const results = await chipSetLoader.loadMany(ids);
    const chipSetEntities = results.filter(
      (cs) => cs instanceof ChipSetEntity,
    ) as ChipSetEntity[];

    return this.chipSetMapper.gqlFromDbMany(chipSetEntities);
  }

  /**
   * @method createChipSet GQL Mutation: create with chips
   */
  @Mutation(() => ChipSetModel, { name: 'createChipSet' })
  @OwnedMethod({
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
  ): Promise<ChipSetModel> {
    const currentUser: Player = context.req.user;

    const chipSet: ChipSet = await this.chipSetService.create(
      chipSetData as CreateChipSetDto,
      currentUser,
    );

    return this.chipSetMapper.gqlFromDomain(chipSet);
  }
}
