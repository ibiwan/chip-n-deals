import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UUID } from 'crypto';
import { EntityManager } from 'typeorm';

import {
  ChipSetEntityModel,
  ChipSetRepository,
  CreateChipSetDto,
} from './chipSet.entityModel';
import { ChipService } from '@/features/chip/chip.service';

@Injectable()
export class ChipSetService {
  constructor(
    @InjectRepository(ChipSetEntityModel)
    private chipSetRepository: ChipSetRepository,

    @InjectEntityManager()
    private em: EntityManager,

    // forwardRef accommodates circular references
    @Inject(
      forwardRef(
        /* istanbul ignore next */
        () => ChipService,
      ),
    )
    private chipService: ChipService,
  ) {}

  async allChipSets(): Promise<ChipSetEntityModel[]> {
    return this.chipSetRepository.find({
      relations: { chips: { chipSet: true } },
    });
  }

  async chipSet(opaqueId: UUID): Promise<ChipSetEntityModel> {
    return this.chipSetRepository.findOne({
      relations: { chips: { chipSet: true } },
      where: { opaqueId },
    });
  }

  async create(data: CreateChipSetDto): Promise<ChipSetEntityModel> {
    const { name, chips: chipsData } = data;
    const chipSet = new ChipSetEntityModel(name, []);

    const chips = await Promise.all(
      chipsData.map((chipData) =>
        this.chipService.createChipModelForChipSetEntity(chipData, chipSet),
      ),
    );
    chipSet.chips = chips;

    await this.em.save(chipSet);

    return chipSet;
  }
}
