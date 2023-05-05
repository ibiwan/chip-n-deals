import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { ChipResolver } from './chip.resolver';
import { ChipEntityModel } from './chip.entityModel';
import { ChipService } from './chip.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChipEntityModel, ChipSetEntityModel])],
  providers: [ChipResolver, ChipService],
  exports: [ChipService]
})
export class ChipModule { }
