import { UUID } from 'crypto';
import { EntityManager, In } from 'typeorm';

import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { ChipService } from '@/features/chip/chip.service';
import { Ownable } from '@/auth/ownership/ownable.interface';
import { PlayerEntityModel } from '@/features/player/player.entityModel';
import { ID } from '@/auth/auth.util';
import { logger, shortStack } from '@/util/logger';

import {
  ChipSetEntityModel,
  ChipSetRepository,
  CreateChipSetDto,
} from './chipSet.entityModel';

@Injectable()
export class ChipSetService implements Ownable<ChipSetEntityModel, null> {
  constructor(
    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: ChipSetRepository,

    @InjectEntityManager()
    private em: EntityManager,

    // forwardRef accommodates circular references
    @Inject(forwardRef(/* istanbul ignore next */ () => ChipService))
    private chipService: ChipService,
  ) {}
  async get(id: ID): Promise<ChipSetEntityModel> {
    if (Number.isInteger(id)) {
      return this.chipSetById(id as number);
    }
    return this.chipSet(id as UUID);
  }

  async allChipSets(): Promise<ChipSetEntityModel[]> {
    logger.trace('chipSet.service:this.chipSetRepository.find', {
      param: null,
      stack: shortStack(),
    });
    return this.chipSetRepository.find();
  }

  async chipSet(opaqueId: UUID): Promise<ChipSetEntityModel> {
    logger.trace('chipSet.service:this.chipSetRepository.findOneBy', {
      opaqueId,
      stack: shortStack(),
    });
    return this.chipSetRepository.findOneBy({ opaqueId });
  }

  async chipSetById(id: number): Promise<ChipSetEntityModel> {
    logger.trace('chipSet.service:this.chipSetRepository.findOneBy', {
      id,
      stack: shortStack(),
    });
    return this.chipSetRepository.findOneBy({ id });
  }

  async chipSetsByIds(ids: readonly number[]): Promise<ChipSetEntityModel[]> {
    logger.trace('chipSet.service:this.chipSetRepository.findBy', {
      ids,
      stack: shortStack(),
    });
    return this.chipSetRepository.findBy({ id: In(ids) });
  }

  async create(
    data: CreateChipSetDto,
    owner: PlayerEntityModel,
  ): Promise<ChipSetEntityModel> {
    const { name, chips: chipsData } = data;
    const chipSet = new ChipSetEntityModel(name, [], owner);

    const chips = await Promise.all(
      chipsData.map((chipData) =>
        this.chipService.createChipModelForChipSetEntity(
          chipData,
          chipSet,
          owner,
        ),
      ),
    );
    chipSet.chips = chips;

    await this.em.save(chipSet);

    return chipSet;
  }

  async getParent(item: ChipSetEntityModel) {
    return null;
  }

  async getOwner(chipSet: ChipSetEntityModel): Promise<UUID> {
    return chipSet.owner.opaqueId;
  }

  async getAllOwners(chipSet: ChipSetEntityModel): Promise<UUID[]> {
    const parent = this.getParent(chipSet);
    // const parentOwners =
    return [];
  }
}
