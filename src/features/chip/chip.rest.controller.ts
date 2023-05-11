import { Body, Controller, Post } from '@nestjs/common';

import { ChipEntityModel, CreateChipDto } from '../chip/chip.entityModel';
import { ChipService } from './chip.service';

@Controller('chip')
export class ChipController {
  constructor(private chipService: ChipService) {}

  @Post('create')
  async create(@Body() createChipDto: CreateChipDto): Promise<ChipEntityModel> {
    return this.chipService.create(createChipDto);
  }
}
