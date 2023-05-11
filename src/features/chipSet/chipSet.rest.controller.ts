import { Body, Controller, Param, Post } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { ChipSetEntityModel, CreateChipSetDto } from '@/features/chipSet/chipSet.entityModel';

@Controller('chipset')
export class ChipSetController {
  constructor(
    @InjectEntityManager()
    private em: EntityManager,
  ) { }

  // @Post('create')
  // async create(@Body() createChipSetDto: CreateChipSetDto) {
  //   const { name } = createChipSetDto

  //   return this.em.save(
  //     new ChipSetEntityModel(name, [])
  //   )
  // }

  @Post('create/:name')
  async createWithName(@Param() param: any) {
    const { name } = param

    return this.em.save(
      new ChipSetEntityModel(name, [])
    )
  }
}
