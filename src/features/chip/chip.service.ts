// world
import { Any, EntityManager, In } from 'typeorm';
import { UUID } from 'crypto';

// framework
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

// other modules
import { ChipSetService } from '@/features/chipSet/chipSet.service';
import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { PlayerEntityModel } from '@/features/player/player.entityModel';
import { Ownable } from '@/auth/ownership/ownable.interface';
import { ID } from '@/auth/auth.util';
import { logger, shortStack } from '@/util/logger';

// this module
import {
  ChipEntityModel,
  ChipRepository,
  CreateChipDto,
  CreateOrphanChipDto,
} from './chip.entityModel';

@Injectable()
export class ChipService
  implements Ownable<ChipEntityModel, ChipSetEntityModel>
{
  constructor(
    @InjectRepository(ChipEntityModel)
    private chipRepository: ChipRepository,

    // forwardRef accommodates circular references
    @Inject(forwardRef(/* istanbul ignore next */ () => ChipSetService))
    private chipSetService: ChipSetService,

    @InjectEntityManager()
    private em: EntityManager,
  ) {}

  async get(id: ID): Promise<ChipEntityModel> {
    if (Number.isInteger(id)) {
      return this.chipByDbId(id as number);
    }
    return this.chipByOpaqueId(id as UUID);
  }

  async chipByDbId(id: number): Promise<ChipEntityModel> {
    logger.trace('chip.service:this.chipRepository.findOneBy', {
      id,
      stack: shortStack(),
    });
    return this.chipRepository.findOneBy({ id });
  }

  async chipByOpaqueId(opaqueId: UUID): Promise<ChipEntityModel> {
    logger.trace('chip.service:this.chipRepository.findOneBy', {
      opaqueId,
      stack: shortStack(),
    });
    return this.chipRepository.findOneBy({ opaqueId });
  }

  findByIds(
    ids: readonly number[],
  ): PromiseLike<ArrayLike<ChipEntityModel | Error>> {
    logger.trace('chip.service:this.chipRepository.findBy', {
      ids,
      stack: shortStack(),
    });
    return this.chipRepository.findBy({ id: In(ids) });
  }

  async allChips(): Promise<ChipEntityModel[]> {
    logger.trace('chip.service:this.chipRepository.find', {
      param: null,
      stack: shortStack(),
    });
    return this.chipRepository.find();
  }

  async chipsForChipSet(id: number): Promise<ChipEntityModel[]> {
    logger.trace('chip.service:this.chipRepository.findBy', {
      id,
      stack: shortStack(),
    });
    return this.chipRepository.findBy({ id });
  }

  async chipsForChipSets(ids: readonly number[]): Promise<ChipEntityModel[]> {
    logger.trace('chip.service:this.chipRepository.findBy', {
      ids,
      stack: shortStack(),
    });
    return this.chipRepository.findBy({ chipSetId: In(ids) });
  }

  async createChipModelForChipSetEntity(
    createChipDto: CreateOrphanChipDto,
    chipSet: ChipSetEntityModel,
    owner: PlayerEntityModel,
  ): Promise<ChipEntityModel> {
    const { color, value } = createChipDto;
    const chip = new ChipEntityModel(color, value, chipSet, owner);

    return chip;
  }

  async create(
    createChipDto: CreateChipDto,
    owner: PlayerEntityModel,
  ): Promise<ChipEntityModel> {
    const { color, value, chipSetOpaqueId } = createChipDto;
    const chipSet = await this.chipSetService.chipSet(chipSetOpaqueId);

    if (!chipSet) {
      throw Error('specified chipSet does not exist');
    }

    const chip = new ChipEntityModel(color, value, chipSet, owner);
    await this.em.save(chip);

    return chip;
  }

  async getParent(chip: ChipEntityModel) {
    return {
      item: chip.chipSet,
      serviceType: typeof ChipSetService,
    };
  }

  getOwner(chip: ChipEntityModel): Promise<UUID> {
    throw new Error('Method not implemented.');
  }

  getAllOwners(chip: ChipEntityModel): Promise<UUID[]> {
    throw new Error('Method not implemented.');
  }
}
