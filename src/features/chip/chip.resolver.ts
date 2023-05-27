import { UUID } from 'crypto';
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

import { Owned, EntityGuard } from '@/auth/authorization/authz.entity.guard';
import { ChipSetService } from '@/features/chipSet/chipSet.service';
import {
  ChipSetByOpaqueIdLoader,
  ChipSetOpaqueDataLoader,
} from '@/features/chipSet/chipSet.dataLoader';

import { ChipService } from './chip.service';
import { ChipDataLoader, ChipsByChipIdLoader } from './chip.dataLoader';
import { PlayerDataLoader, PlayerLoader } from '../player/player.dataLoader';
import { ChipModel } from './schema/chip.gql.model';
import { ChipSetModel } from '../chipSet/schema/chipSet.gql.model';
import { Chip } from './schema/chip.domain.object';
import { Player } from '../player/schema/player.domain.object';
import { CreateChipDto } from './schema/chip.gql.dto.create';

@UseInterceptors(EntityGuard)
// @UseGuards(AuthGuard)
@Resolver(/* istanbul ignore next */ () => ChipModel)
export class ChipResolver {
  constructor(
    private chipService: ChipService,
    private chipSetService: ChipSetService,
  ) {}

  private readonly logger = new Logger(this.constructor.name);

  @Query(/* istanbul ignore next */ () => [ChipModel])
  async allChips(): Promise<ChipModel[]> {
    this.logger.verbose(`allChips`);
    const chips = (await this.chipService.allChips()).map((chip) =>
      ChipModel.fromDomainObject(chip),
    );
    return chips;
  }

  @Query(() => [ChipModel])
  async chipsForChipSet(
    @Args('chipset_opaque_id', { type: () => String })
    opaqueId: UUID,
  ): Promise<ChipModel[]> {
    this.logger.verbose(`chipsForChipSet: opaqueId = ${opaqueId}`);
    const chipSet = await this.chipSetService.chipSet(opaqueId);
    return (await this.chipService.chipsForChipSet(chipSet.id)).map((chip) =>
      ChipModel.fromDomainObject(chip),
    );
  }

  @ResolveField()
  async chipSet(
    @Parent() chip: Chip,
    @Loader(ChipSetByOpaqueIdLoader)
    chipSetOpaqueLoader: ChipSetOpaqueDataLoader,
  ): Promise<ChipSetModel> {
    this.logger.verbose(`chipSet: id = ${chip.chipSet.opaqueId}`);
    return ChipSetModel.fromDomainObject(
      await chipSetOpaqueLoader.load(chip.chipSet.opaqueId),
    );
  }

  @ResolveField()
  async owner(
    @Parent() chip: Chip,
    @Loader(PlayerLoader)
    playerLoader: PlayerDataLoader,
  ): Promise<Player> {
    this.logger.verbose(`player: id = ${chip.owner.id}`);
    const owner = await playerLoader.load(chip.owner.id);
    return owner;
  }

  @Query(() => [ChipModel])
  async getChips(
    @Args({ name: 'ids', type: () => [Number] }) ids: number[],
    @Loader(ChipsByChipIdLoader)
    chipLoader: ChipDataLoader,
  ): Promise<(Error | ChipModel)[]> {
    this.logger.verbose(`getChips: ids = ${ids.join(', ')}`);

    return (await chipLoader.loadMany(ids))
      .filter((chip) => chip instanceof Chip)
      .map((chip) => ChipModel.fromDomainObject(chip as Chip));
  }

  @Mutation(() => ChipModel)
  @Owned({
    getParentId: (data) => data.chipData.chipSetOpaqueId,
    parentService: ChipSetService,
  })
  async createChip(
    @Args({
      name: 'chipData',
      type: () => CreateChipDto,
    })
    chipData: CreateChipDto,

    @Context() context,
  ): Promise<ChipModel> {
    this.logger.verbose(
      `createChip: color = ${chipData.color}, chipSet = ${chipData.chipSetOpaqueId}`,
    );

    const currentUser = context.req.user as Player;

    return ChipModel.fromDomainObject(
      await this.chipService.create(chipData, currentUser),
    );
  }
}
