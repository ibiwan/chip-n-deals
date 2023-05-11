import { Controller, Param, Post } from '@nestjs/common';

import { ChipSetService } from './chipSet.service';

@Controller('chipset')
export class ChipSetController {
  constructor(
    private chipSetService: ChipSetService,
  ) { }

  @Post('create/:name')
  async createWithName(@Param() param: any) {
    const { name } = param
    return this.chipSetService.createWithName(name)
  }
}
