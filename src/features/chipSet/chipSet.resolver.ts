import { UUID } from 'crypto';
import * as DataLoader from 'dataloader';
import { Loader } from 'nestjs-dataloader';

import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Logger, UseInterceptors } from '@nestjs/common';

import { EntityGuard, Owned } from '@/auth/authorization/authz.entity.guard';

import { ChipsByChipSetIdLoader } from '@/features/chip/chip.dataLoader';
import { Player } from '@/features/player/schema/player.domain.object';

import { CreateChipSetDto } from './schema/chipSet.gql.dto.create';
import { ChipSetEntity } from './schema/chipSet.db.entity';
import { PlayerDataLoader, PlayerLoader } from '../player/player.dataLoader';
import { ChipSetModel } from './schema/chipSet.gql.model';
import { ChipSetLoader } from './chipSet.dataLoader';
import { ChipSetService } from './chipSet.service';
import { ChipSet } from './schema/chipSet.domain.object';
import { ChipDataLoader } from '@/features/chip/chip.dataLoader';

@UseInterceptors(EntityGuard)
@Resolver(() => ChipSetModel)
export class ChipSetResolver {
  constructor(
    private chipSetService: ChipSetService, // private logger: Logger,
  ) {}
  private readonly logger = new Logger(this.constructor.name);

  /**
   * @method allChipSets GQL Query: all, with chips
   */
  @Query(() => [ChipSetModel])
  async allChipSets(): Promise<ChipSetModel[]> {
    this.logger.verbose(`allChipSets`);

    const chipSets = (await this.chipSetService.allChipSets()).map((chipSet) =>
      ChipSetModel.fromDomainObject(chipSet),
    );
    return chipSets;
  }

  /**
   * @method chipSet GQL Query: fetch one by opaqueId
   */
  @Query(() => ChipSetModel)
  async chipSet(
    @Args('opaque_id', { type: () => String })
    opaqueId: UUID,
  ): Promise<ChipSetModel> {
    this.logger.verbose(`chipSet: opaqueId = ${opaqueId}`);
    const chipSet = await this.chipSetService.chipSet(opaqueId);
    return ChipSetModel.fromDomainObject(chipSet);
  }

  /**
   * @method chips GQL Field: resolve ChipSet.chips
   */
  @ResolveField()
  async chips(
    @Parent() chipSet: ChipSet,
    @Loader(ChipsByChipSetIdLoader)
    chipLoader: ChipDataLoader,
  ) {
    this.logger.verbose(`chips: chipSet.id = ${chipSet.id}`);

    return chipLoader.load(chipSet.id);
  }

  @ResolveField()
  async owner(
    @Parent() chipSet: ChipSet,
    @Loader(PlayerLoader)
    playerLoader: PlayerDataLoader,
  ): Promise<Player> {
    this.logger.verbose(`player: id = ${chipSet.owner.id}`);

    const owner = await playerLoader.load(chipSet.owner.id);
    return owner;
  }

  @Query(() => [ChipSetModel])
  async getChipSets(
    @Args({ name: 'ids', type: () => [Number] }) ids: number[],
    @Loader(ChipSetLoader)
    chipSetLoader: DataLoader<ChipSetEntity['id'], ChipSetModel>,
  ): Promise<(Error | ChipSetModel)[]> {
    this.logger.verbose(`getChipSets: ids = ${ids}`);

    return chipSetLoader.loadMany(ids);
  }

  /**
   * @method createChipSet GQL Mutation: create with chips
   */
  @Mutation(() => ChipSetModel, { name: 'createChipSet' })
  @Owned({
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
    const currentUser = context.req.user as Player;

    this.logger.verbose(
      `createChipSet: name = ${chipSetData.name}, current user = ${currentUser.id}: ${currentUser.username}`,
    );

    return ChipSetModel.fromDomainObject(
      await this.chipSetService.create(chipSetData, currentUser),
    );
  }
}
