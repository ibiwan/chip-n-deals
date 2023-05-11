import { EntityManager } from 'typeorm';

import { Body, Controller, Inject, Post, forwardRef } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

import { CreateChipDto } from '../chip/chip.entityModel';
import { ChipSetService } from '@/features/chipSet/chipSet.service';
import { ChipService } from './chip.service';

@Controller('chip')
export class ChipController {
  constructor(
    @InjectEntityManager()
    private em: EntityManager,

    @Inject(forwardRef(() => ChipSetService))
    private chipSetService: ChipSetService,

    private chipService: ChipService,
  ) { }

  @Post('create')
  async create(@Body() createChipDto: CreateChipDto) {
    return this.chipService.createChip(createChipDto);
  }
}
