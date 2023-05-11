import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UUID } from 'crypto';

import {
  ChipEntityModel,
  ChipRepository,
  CreateChipDto,
} from './chip.entityModel';
import { ChipSetService } from '../chipSet/chipSet.service';

@Injectable()
export class ChipService {
  constructor(
    @InjectRepository(ChipEntityModel)
    private chipRepository: ChipRepository,

    // forwardRef accommodates circular references
    @Inject(forwardRef(() => ChipSetService))
    private chipSetService: ChipSetService,

    @InjectEntityManager()
    private em: EntityManager,
  ) {}

  async allChips(): Promise<ChipEntityModel[]> {
    return this.chipRepository.find({
      relations: {
        chipSet: true,
      },
    });
  }

  async chipsForChipSet(opaqueId: UUID): Promise<ChipEntityModel[]> {
    const chipSet = await this.chipSetService.chipSet(opaqueId);

    return chipSet.chips;
  }

  async createChip(createChipDto: CreateChipDto): Promise<ChipEntityModel> {
    const { color, value, chipSetOpaqueId } = createChipDto;

    const chipSet = await this.chipSetService.chipSet(chipSetOpaqueId);

    const chip = new ChipEntityModel(color, value, chipSet);
    this.em.save(chip);

    return chip;
  }
}
