import { EntityManager, Repository } from 'typeorm';

import { Body, Controller, Inject, Post, forwardRef } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

import { ChipEntityModel, CreateChipDto } from '../chip/chip.entityModel';
import { ChipSetService } from '@/features/chipSet/chipSet.service';

@Controller('chip')
export class ChipController {
  constructor(
    @InjectEntityManager()
    private em: EntityManager,

    @InjectRepository(ChipEntityModel)
    private chipSetRepository: Repository<ChipEntityModel>,

    @Inject(forwardRef(() => ChipSetService))
    private chipSetService: ChipSetService,
  ) { }

  @Post('create')
  async create(@Body() createChipDto: CreateChipDto) {
    const { color, value, chipSetOpaqueId } = createChipDto

    const chipSet = await this.chipSetService.chipSet(chipSetOpaqueId)

    const chip = new ChipEntityModel()
    chip.color = color;
    chip.value = value
    chip.chipSet = chipSet;
    this.em.save(chip)

    return chip
  }
}
