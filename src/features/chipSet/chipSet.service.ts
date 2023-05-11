import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UUID } from 'crypto';
import { EntityManager } from 'typeorm';

import {
  ChipSetEntityModel,
  ChipSetRepository,
  CreateChipSetDto,
} from './chipSet.entityModel';
import { ChipService } from '../chip/chip.service';

@Injectable()
export class ChipSetService {
  constructor(
    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: ChipSetRepository,

    @InjectEntityManager()
    private em: EntityManager,

    // forwardRef accommodates circular references
    @Inject(forwardRef(() => ChipService))
    private chipService: ChipService,
  ) { }

  async chipSet(opaqueId: UUID): Promise<ChipSetEntityModel> {
    return this.chipSetRepository.findOne({
      relations: { chips: { chipSet: true } },
      where: { opaqueId },
    });
  }

  async createWithName(name: string): Promise<ChipSetEntityModel> {
    return this.em.save(new ChipSetEntityModel(name, []));
  }

  async create(data: CreateChipSetDto): Promise<ChipSetEntityModel> {
    const { name, chips: chipsData } = data;
    const chipSet = new ChipSetEntityModel(name, []);

    const chips = await Promise.all(
      chipsData.map((chipData) =>
        this.chipService.createFor(chipData, chipSet)
      ),
    );
    chipSet.chips = chips

    await this.em.save(chipSet)

    return chipSet;
  }
}
