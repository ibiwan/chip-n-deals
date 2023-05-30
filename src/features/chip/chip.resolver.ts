import {
  Inject,
  // , UseInterceptors
  forwardRef,
} from '@nestjs/common';
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

import {
  PlayerDataByOpaqueIdLoader,
  PlayerByOpaqueIdLoader,
  PlayerDataByIdLoader,
  PlayerByIdLoader,
  PlayerMapper,
  PlayerEntity,
  PlayerModel,
  Player,
} from '@/features/player';

import {
  ChipSetByOpaqueIdLoader,
  ChipSetOpaqueDataLoader,
  ChipSetService,
  ChipSetMapper,
  ChipSetModel,
} from '@/features/chipSet';

import { ChipsByChipIdLoader, ChipDataLoader } from './loaders';

import {
  CreateChipDto,
  ChipModel,
  ChipMapper,
  ChipEntity,
  Chip,
} from './schema';

import { ChipService } from './chip.service';
import { OwnedMethod } from '@/auth/authorization/owned.decorator';

// @UseInterceptors(EntityGuard)
// @UseGuards(AuthGuard)
@Resolver(() => ChipModel)
export class ChipResolver {
  constructor(
    @Inject(forwardRef(() => PlayerMapper))
    private playerMapper: PlayerMapper,
    @Inject(forwardRef(() => ChipSetMapper))
    private chipSetMapper: ChipSetMapper,

    private chipService: ChipService,
    private chipMapper: ChipMapper,
  ) {
    console.log({ OwnedMethod });
  }

  @Query(() => [ChipModel])
  async allChips(): Promise<ChipModel[]> {
    const chips = await this.chipService.allChips();

    return this.chipMapper.gqlFromDomainMany(chips);
  }

  @Query(() => [ChipModel])
  async chipsForChipSet(
    @Args('chipset_opaque_id', { type: () => String })
    opaqueId: UUID,
  ): Promise<ChipModel[]> {
    const chips = await this.chipService.chipsForChipSetsByOpaqueIds([
      opaqueId,
    ]);

    return this.chipMapper.gqlFromDomainMany(chips);
  }

  @ResolveField()
  async chipSet(
    @Parent() chip: Chip,
    @Loader(ChipSetByOpaqueIdLoader)
    chipSetOpaqueLoader: ChipSetOpaqueDataLoader,
  ): Promise<ChipSetModel> {
    console.log('CHIP.CHIPSET RESOLVER');
    const chipSetEntity = await chipSetOpaqueLoader.load(chip.chipSet.opaqueId);

    return this.chipSetMapper.gqlFromDb(chipSetEntity);
  }

  @ResolveField()
  async owner(
    @Parent() chip: Chip,
    @Loader(PlayerByOpaqueIdLoader)
    playerLoader: PlayerDataByOpaqueIdLoader,
  ): Promise<PlayerModel> {
    const ownerEntity = await playerLoader.load(chip.owner.opaqueId);

    return this.playerMapper.gqlFromDb(ownerEntity);
  }

  @Query(() => [ChipModel])
  async getChips(
    @Args({ name: 'ids', type: () => [Number] }) ids: number[],
    @Loader(ChipsByChipIdLoader)
    chipLoader: ChipDataLoader,
  ): Promise<(Error | ChipModel)[]> {
    const chipEntityMaybes = await chipLoader.loadMany(ids);
    const chipEntities = chipEntityMaybes.filter(
      (c) => c instanceof Chip,
    ) as ChipEntity[];

    return this.chipMapper.gqlFromDbMany(chipEntities);
  }

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
    const currentUserEntity = context.req.user as PlayerEntity;
    const chip = await this.chipService.create(chipData, currentUserEntity);

    const chipModel = await this.chipMapper.gqlFromDomain(chip);
    return chipModel;
  }
}
