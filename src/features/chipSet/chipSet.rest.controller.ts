import { Controller, Param, Post } from '@nestjs/common';

import { ChipSetService } from './chipSet.service';
import { ChipSetEntityModel } from './chipSet.entityModel';

@Controller('chipset')
export class ChipSetController {
  constructor(private chipSetService: ChipSetService) {}

  @Post('create/:name')
  async createWithName(@Param() param: any): Promise<ChipSetEntityModel> {
    const { name } = param;
    return this.chipSetService.createWithName(name);
  }
}
